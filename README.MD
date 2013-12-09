<b>RolesCreator Extension for OpenIDM</b>
<br/>
<br/>
This set of libraries can help create role objects, role entitlements and user entitlement exceptions, as part of a set of custom endpoints when used with ForgeRock's OpenIDM product.
<br/>
<b>Note this set of files is in no way officially supported by ForgeRock and is made available simply as a community contribution.  Use as-is, no warranty.</b> 
<br/>
<br/>
<b>SETUP</b>
<br/>
<b>Endpoints</b>
<br/>
Copy the endpoint- prefixed files into the openidm/conf directory, and edit the access.js file to allow access to them.
<br/>
<b>Scripts</b>
<br/>
Copy all .js Javascript files into the openidm/script directory
<br/>
<br/>
<b>USAGE - createRoles</b>
<br/>
<b>http://server:port/openidm/endpoint/createRoles?sourceSystem=managed/user&sourceAttribute=jobTitle&userAttribute=employeeNumber</b>
<br/>
Args - sourceSystem: the source system that OpenIDM is managing and the system used for mining business roles.  Generally an auth source such as HR, or the managed/user source itself.  sourceAttribute is what the role mining process will analyse.  Generally
something like job title, manager, department or so on.  userAttribute is the unique user attribute used to populate the role object.  Generally something like email, uid etc.
<br/>
Returns - JSON object containing business roles and the users associated with them.  This file can then be saved as a custom endpoint and be read during provisioning.
<br>

