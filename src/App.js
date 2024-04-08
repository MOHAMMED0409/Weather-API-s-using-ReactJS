import "./App.css";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignIn, AmplifySignUp } from '@aws-amplify/ui-react';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const listener = onAuthUIStateChange((authState, authData) => {
      console.log(`authState: ${authState}`);
      console.log(`authData: ${JSON.stringify(authData)}`);
    });
    return () => listener();
  }, []);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (responses) => {
        const weatherResponse = await responses[0].json();
        const forecastResponse = await responses[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
  };

  return (
    <AmplifyAuthenticator>
      <Router>
        <div className="container">
          <Switch>
            <Route path="/signin">
              <SignInPage />
            </Route>
            <Route path="/signup">
              <SignUpPage />
            </Route>
            <Route path="/dashboard">
              <DashboardPage />
            </Route>
            <Route path="/forgotpassword">
              <ForgotPasswordPage />
            </Route>
            <Route path="/">
              <Search onSearchChange={handleOnSearchChange} />
              {currentWeather && <CurrentWeather data={currentWeather} />}
              {forecast && <Forecast data={forecast} />}
            </Route>
          </Switch>
        </div>
      </Router>
    </AmplifyAuthenticator>
  );
}

function SignInPage() {
  return (
    <div>
      <h2>Sign In</h2>
      <AmplifySignIn />
    </div>
  );
}

function SignUpPage() {
  return (
    <div>
      <h2>Sign Up</h2>
      <AmplifySignUp />
    </div>
  );
}

function DashboardPage() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>This is the dashboard page. Only accessible after signing in.</p>
      <AmplifySignOut />
    </div>
  );
}

function ForgotPasswordPage() {
  return (
    <div>
      <h2>Forgot Password</h2>
      <AmplifyAuthenticator>
        <AmplifySignIn slot="sign-in" hideSignUp />
      </AmplifyAuthenticator>
    </div>
  );
}

export default App;
