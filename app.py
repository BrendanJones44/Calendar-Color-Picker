from flask import Flask, session, redirect, url_for, request, jsonify
import os
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

app = Flask(__name__)
app.secret_key = "b'\xae\\[\x87\xae\x91\xc5\xcfK\x87\xdd\xf9(\x80\x1a3\xc8\xa1\xd4\x82\xbe\xbb\x17\x14'"

CLIENT_SECRETS_FILE = "client_secret.json"
SCOPES = ['https://www.googleapis.com/auth/calendar']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'

@app.route("/")
def hello():
    return 'Welcome to Cal Colors! <a href="/calendar"> Class List </a>'

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

  # Store credentials in the session.
  # ACTION ITEM: In a production app, you likely want to save these
  #              credentials in a persistent database instead.
  credentials = flow.credentials
  session['credentials'] = credentials_to_dict(credentials)

  return redirect(url_for('calendar_items'))

@app.route('/calendar')
def calendar_items():
  if 'credentials' not in session:
    return redirect('authorize')

  # Load credentials from the session.
  credentials = google.oauth2.credentials.Credentials(
      **session['credentials'])

  cal_svc = googleapiclient.discovery.build(
      API_SERVICE_NAME, API_VERSION, credentials=credentials)

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

  # Save credentials back to session in case access token was refreshed.
  session['credentials'] = credentials_to_dict(credentials)

  grouped_cal_items = {}
  for cal_item in cal_items:
    if 'location' in cal_item.keys():
      event_location = cal_item['location']
      if event_location in grouped_cal_items.keys():
        grouped_cal_items[event_location].append(cal_item)
      else:
        grouped_cal_items[event_location] = [cal_item]

  return jsonify(grouped_cal_items)

def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}

if __name__ == '__main__':
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    app.run()