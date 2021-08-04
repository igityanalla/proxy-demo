import './App.css';
import {useState} from 'react';

const baseUrl = "http://192.168.1.14"
const serverPort = 3001;
let proxyIdentifier;

function App() {
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [noSession, setNoSession] = useState(true);
    const [logs, setLogs] = useState([]);
    const [requestAvailable, setRequestAvailable] = useState(true);
    const [numberAvailable, setNumberAvailable] = useState(false);

    function init() {
        setNoSession(false);
        createSession();
    }

    async function createSession() {
        log("Creating a new session...");
        let url = `${baseUrl}:${serverPort}/create-session`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log(response.body);
        log("Session is successfully created!");
    }

    async function registerPhoneNumber() {
        log("Registering a phone number...")

        let url = `${baseUrl}:${serverPort}/register`;
        let data = {"number": number, "name": name};
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        setRequestAvailable(false);
        log("Phone number successfully registered!")
        console.log(response);
    }

    async function requestNumber() {
        log("Requesting a number...")
        setRequestAvailable(false);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        let url = `${baseUrl}:${serverPort}/request-number`;
        const response = fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                proxyIdentifier = data.proxyIdentifier;
                setNumberAvailable(true);
                log(`You can call ${proxyIdentifier} now!`);
            });
    }

    function log(message) {
        logs.unshift(message)
        setLogs([...logs]);
        console.log(logs);
    }

    return (
        <div className="App">
            {noSession && <button onClick={init}>Create Session</button>}
            <br/>
            <input hidden={noSession} placeholder='Name' value={'Alla'} onChange={(e) => {
                setName(e.target.value);
            }}/>
            <br/>
            <input hidden={noSession} placeholder='Phone Number' value={'+491771919691'} onChange={(e) => {
                setNumber(e.target.value);
            }}/>
            <br/>fi
            <button hidden={noSession} onClick={registerPhoneNumber}>Register</button>
            <br/>
            <button hidden={requestAvailable} onClick={requestNumber}>Request a number</button>
            <br/>

            <a hidden={!numberAvailable} href={"tel:" + proxyIdentifier}>Call {proxyIdentifier}</a>
            <br/>
            <div>
                {logs.map(function (item, i) {
                    return <p key={i}>{item}</p>
                })}
            </div>
        </div>
    );
}

export default App;
