from dateutil import parser
from flask import Flask, session, redirect, url_for, request, jsonify, render_template
from ast import literal_eval
import os
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery
import google.auth.transport.requests
app = Flask(__name__)
app.secret_key = os.urandom(16)

CLIENT_SECRETS_FILE = "client_secret.json"
SCOPES = ['https://www.googleapis.com/auth/calendar']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'

GOOGLE_CAL_BACKGROUND_COLORS = {
  "1": "#A4BDFC",
  "2": "#7AE7BF",
  "3": "#DBADFF",
  "4": "#FF887C",
  "5": "#FBD878",
  "6": "#FFB878",
  "7": "#46D6DB",
  "8": "#E1E1E1",
  "9": "#5484ED",
  "10": "#51B749",
  "11": "#DC2127",
}

@app.route('/authorize')
def authorize():
  # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      CLIENT_SECRETS_FILE, scopes=SCOPES)

  flow.redirect_uri = url_for('oauth2callback', _external=True)

  authorization_url, state = flow.authorization_url(
      access_type='offline',
      include_granted_scopes='true')

  # Store the state so the callback can verify the auth server response.
  session['state'] = state

  return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
  # Specify the state when creating the flow in the callback so that it can
  # verified in the authorization server response.
  state = session['state']

  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
  flow.redirect_uri = url_for('oauth2callback', _external=True)

  # Use the authorization server's response to fetch the OAuth 2.0 tokens.
  authorization_response = request.url
  flow.fetch_token(authorization_response=authorization_response)

  credentials = flow.credentials
  session['credentials'] = credentials_to_dict(credentials)

  return redirect(url_for('calendar_items'))

@app.route('/')
def calendar_items():
  if 'credentials' not in session:
    return redirect('authorize')

  credentials = google.oauth2.credentials.Credentials(
      **session['credentials'])

  cal_svc = googleapiclient.discovery.build(
      API_SERVICE_NAME, API_VERSION, credentials=credentials)

  try:
    cal_items = grab_calendar_items(cal_svc)
  except google.auth.exceptions.RefreshError:
    return redirect('authorize')

  # Save credentials back to session in case access token was refreshed.
  session['credentials'] = credentials_to_dict(credentials)

  grouped_cal_items = {}
  for cal_item in cal_items:
    if 'location' in cal_item.keys():
      event_location = cal_item['location']
      event_name = cal_item['summary']
      event_key = event_name + ', ' + event_location
      if event_key in grouped_cal_items.keys():
        grouped_cal_items[event_key].append(cal_item)
      else:
        grouped_cal_items[event_key] = [cal_item]

  # Strip any events that don't recure often
  recurrence_threshold = 10
  grouped_events = dict(
    (key,value) for key, value in grouped_cal_items.items() if len(value) >= recurrence_threshold
  )

  return render_template("grouped_events.html", grouped_events = grouped_events, color_map = GOOGLE_CAL_BACKGROUND_COLORS, enumerate=enumerate)

@app.route('/color_selection', methods = ['POST'])
def color_selection():
  credentials = google.oauth2.credentials.Credentials(
      **session['credentials'])

  cal_svc = googleapiclient.discovery.build(
      API_SERVICE_NAME, API_VERSION, credentials=credentials)

  newColorId = request.json["newColorId"]

  for event in request.json["events"]:
      event["colorId"] = newColorId
      updated_event = cal_svc.events().update(
        calendarId='primary', 
        eventId=event['id'], 
        body=event
      ).execute()
  return "form submitted"

  

def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}

def grab_calendar_items(cal_svc):
  cal_items = []
  page_token = None
  semester_start = "2018-08-27T08:00:00-05:00"
  semester_end =   "2018-12-18T23:00:00-05:00"
  while True:
    events = cal_svc.events().list(calendarId='primary',
                                  timeMin=semester_start,
                                  timeMax=semester_end,
                                  pageToken=page_token).execute()
    for event in events['items']:
      cal_items.append(event)
    page_token = events.get('nextPageToken')
    if not page_token:
      break
  return cal_items

if __name__ == '__main__':
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    app.run()