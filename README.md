# apic-training-api
Back-end API Connect training service

# Install dependencies
npm install

# environment variables
*  **NODE_ENV**: define the execution scope. 
Possible values are:
 <br/> 
 <br/>'development': Development execution scope. The App connect to localhost database.
 <br/>'production': Production execution scope. The App connect to external database.

* **CREATE_TABLES**: configure the generation data model execution script
Possible values are: 
 <br/>
 <br/>'1': The App regenerate the data model, drop all resources and recreate again them.
 <br/>'0': The App not regenerate the data, maintaining the existing.

# Start App from Shell
export NODE_ENV='development' <br/>
export CREATE_TABLES='1' <br/><br/>
node server/server.js

# Start App from Apic Designer using IBM Cloud Id account
apic edit

# Open App
http://127.0.0.1:4000

# Open App Explorer API from Shell execution
http://127.0.0.1:4000/explorer

# Open App and Explorer API from Apic Designer
http://127.0.0.1:9000/login.html

# Debug App
Start App in debug from Visual Code mode and use workbench editors.