# Background Information:
Importing classes into Google Calendar is incredibly easy:

- Simply go to tigercenter.rit.edu and download your .ics file for the semester
![Tiger Center Screenshot](tigerCenter.png?raw=true "Tiger Center")
- You can then import all your classes into Google Calendar with that .ics file
![Importing to Google Calendar](calImport.png?raw=true "Import")
- All your classes are then loaded into Google Calendar with locations & times:
![Class Calendar](classCalendar.png?raw=true "Calendar")

# The problem:
Because the .ics file treats each calendar event as independent, if you wanted to change the background color of a class, you'd need to go through each instance of the class and change it individually.

That was the motivation behind this application.

## Requirements
- Python >= (3.0.0)
- Pip >= (3.0.0)

## Installation & Setup
```pip install -r requirements.txt```

You must provide a `client_secret.json` file at the root level of the repository.
To generate a key: [follow this guide](https://developers.google.com/api-client-library/python/guide/aaa_client_secrets)

## Start up:
- ```python app.py```
- navigate to localhost:5000 and authenticate with Google
- You then can select colors to change classes
![Demonstration](demo.gif "Demonstration")

