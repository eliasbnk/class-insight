import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet';
import { Card, Image, Icon, Label, Grid, Header, Dimmer, Loader } from 'semantic-ui-react';
import './App.css';
import ztc from './ztc.svg';
import lowcost from './lowcost.svg';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCYfswQAdpubsT_86BOD70bnM-MiCvt8Vs",

  authDomain: "class-insight.firebaseapp.com",

  projectId: "class-insight",

  storageBucket: "class-insight.appspot.com",

  messagingSenderId: "70430332090",

  appId: "1:70430332090:web:d11b52494e7b14aa535e83"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();



const ProfessorRating = ({ legacyId, firstName, lastName, school, avgRating, avgDifficulty, wouldTakeAgainPercent, numRatings }) => (
  <>
    <Grid.Row style={{ marginBottom: 0, paddingBottom: 0, justifyContent: 'flex-start', paddingLeft: '3.6em', fontSize: '0.8em' }}>
      <a id="link-icon" href={`https://www.ratemyprofessors.com/professor/${legacyId}`} target="_blank" rel="noopener noreferrer nofollow">{`${firstName} ${lastName} - ${school}`}</a>
    </Grid.Row>
    <Grid.Row style={{ marginTop: 0, paddingTop: 0 }}>
      <Grid.Column style={{paddingRight: 0}}>
        <div><span id="rating-label"># of Ratings:</span></div>
        <div className="rating-info"><Icon name='users' color='grey' />{numRatings}</div>
      </Grid.Column>
      <Grid.Column style={{paddingRight: 0}}>
        <div><span id="rating-label">Avg. Rating:</span></div>
        <div className="rating-info"><Icon name='star' color='yellow' />{avgRating}/5</div>
      </Grid.Column>
      <Grid.Column style={{paddingRight: 0}}>
        <div><span id="rating-label">Easy-Going:</span></div>
        <div className="rating-info"><Icon name={(5-avgDifficulty) < 3 ? 'frown outline' : (5-avgDifficulty) < 4 ? 'meh outline' : 'smile outline'} color={(5-avgDifficulty) < 3 ? 'red' : (5-avgDifficulty) < 4 ? 'orange' : 'green'} />{(5-avgDifficulty).toFixed(1)}/5</div>
      </Grid.Column>
      <Grid.Column style={{paddingRight: 0}}>
        <div><span id="rating-label">Take Again:</span></div>
        <div className="rating-info"><Icon name='redo' color='olive' />{wouldTakeAgainPercent === -1 ? "N/A" : Math.floor(wouldTakeAgainPercent)}{(wouldTakeAgainPercent !== -1) && "%"}</div>
      </Grid.Column>
    </Grid.Row>
  </>
);

const ClassCard = ({ classNumber, classDesc, classStatus, classUnit, classLocation, classMode, classSections, classZTC, classLowCost, professorNames, classDays, classTimes, professorRatings }) => {
  return (
    <Card style={{padding: '0.5rem', margin: '10 10', minWidth: 348, maxWidth: 956}} fluid className="class-card">
      <Card.Header>
        <Grid columns={2} unstackable>
          <Grid.Row style={{paddingBottom: 0, marginBottom: 0}}>
            <Grid.Column>
              <Header style={{margin: 0, padding: 0}}>{classNumber}</Header>
              </Grid.Column>
              <Grid.Column style={{paddingLeft: 0, display: 'flex', justifyContent: 'flex-end'}} textAlign='right'>
              {(classZTC ||classLowCost) && (<div className='tooltip'>
                <Image size={(classZTC || classLowCost) && 'mini'} src={(classZTC && ztc) || (classLowCost && lowcost)} />
                <span className="tooltiptext">{classZTC ? 'Zero Textbook Cost' : 'Low Cost Textbook'}</span>
              </div>
              )}
              <Label>{classUnit} {classUnit > 1 ? 'units' : 'unit'}</Label>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{paddingLeft: '1em', paddingTop: 0, marginTop: 0}}>
              <Header>{classDesc}</Header>
          </Grid.Row>
        </Grid>
      </Card.Header>
      <Card.Meta>
        <span>{classLocation}</span>
      </Card.Meta>
      <Card.Content>
        <Header as={'h5'}>Class Information:</Header>
        <Grid columns={4} centered className="class-info-grid">
          <Grid.Row style={{ marginBottom: 0, paddingBottom: 0 }}>
            <Grid.Column className='column-header' style={{paddingRight: 0}}>status:</Grid.Column>
            <Grid.Column className='column-header' style={{paddingRight: 0}}>mode:</Grid.Column>
            <Grid.Column className='column-header' style={{paddingRight: 0}}>{professorNames.length > 1 ? 'instructors:' : 'instructor:'}</Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ marginTop: 0, paddingTop: 0, paddingBottom: 0, marginBottom:0 }}>
            <Grid.Column className='column-info' style={{paddingRight: 0}}>
              <Icon name="circle" color={classStatus === 'open' ? 'green' : classStatus === 'waitlist' ? 'orange' : 'red'} /> {classStatus}
            </Grid.Column>
            <Grid.Column className='column-info' style={{paddingRight: 0}}>
              <Icon name={(classMode === 'Fully Online' || classMode === 'Fully Online - Synchronous') ? 'wifi' : classMode === 'In Person' ? 'building outline' : classMode === 'Partially Online' ? 'travel' : 'building outline'} /> {classMode}
            </Grid.Column>
            <Grid.Column className='column-info' style={{paddingRight: 0}}>
              {professorNames.map((professor, id) => (
                <div key={`${professor}-${id}`}>
                  <Icon name={'user'} />
                  <a id='link-icon' href="#" target="_blank" rel="noopener noreferrer nofollow">{professor}</a>
                </div>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid columns={4} className="class-info-grid" centered>
          <Grid.Row style={{ marginBottom: 0, paddingBottom: 0 }}>
            <Grid.Column className='column-header'>class:</Grid.Column>
            <Grid.Column className='column-header'>day:</Grid.Column>
            <Grid.Column className='column-header'>time:</Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ marginTop: 0, paddingTop: 0 }}>
            <Grid.Column className='column-info' style={{paddingRight: 0}}>
              {classSections.map((section, id) => (
                <div key={`${section}-${id}`}>
                  <Icon name={section.includes("LEC") ? 'pencil alternate' : 'lab'} /> {section}
                </div>
              ))}
            </Grid.Column>
            <Grid.Column className='column-info' style={{paddingRight: 0}}>
              {classDays.map((c, id) => (
                <div key={id}>
                  <Icon name={c.includes("Asynchronous") ? 'calendar times outline' : 'calendar check outline'} />
                  {c}
                </div>
              ))}
            </Grid.Column>
            <Grid.Column className='column-info' style={{paddingRight: 0}}>
              {classTimes.map((c, id) => (
                <div key={id}>
                  <Icon name={'clock'} /> {c.includes("Asynchronous") ? 'no meetings' : c}
                </div>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
      {professorRatings && (
  <Card.Content extra className="class-extra-content">
    <div>
      <Header as={'h5'}>{professorNames.length > 1 ? 'Instructors Ratings:' : 'Instructor Ratings:'}</Header>
      <Grid columns={5} centered className="professor-ratings-grid">
        {professorRatings.map((rating, id) => (
          <ProfessorRating key={`${rating.legacyId}-${id}`} {...rating} />
        ))}
      </Grid>
    </div>
  </Card.Content>
)}
    </Card>
  );
}

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] =useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const snapshot = await db.collection('summer_semester').get();
        const newData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(newData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally{
        setIsLoading(false)
      }
    };

    fetchData();

    // Cleanup function if needed
    return () => {};
  }, []);

  return (
    <div className="center-container">
      <Helmet>
        <style>{'body { background-color: #d3d3d3; font-family: "Poppins", sans-serif; color: black; }'}</style>
      </Helmet>
      {isLoading ? (
        <Dimmer active>
          <Loader>Fetching data...</Loader>
        </Dimmer>
      ) : (
        <>
          <Card.Group centered>
            {data.map((c, id) => (
              <ClassCard
                key={`${c.classNumber}-${id}`}
                classNumber={c.classNumber}
                classDesc={c.classDesc}
                classStatus={c.classStatus}
                classUnit={c.classUnit}
                classLocation={c.classLocation}
                classMode={c.classMode}
                classSections={c.classSections}
                classZTC={c.classZTC}
                classLowCost={c.classLowCost}
                professorNames={c.professorNames || ["null"]}
                classDays={c.classDate}
                classTimes={c.classTime}
                professorRatings={c.professorRatings || null}
              />
            ))}
          </Card.Group>
        </>
      )}
    </div>
  );
};

export default App;