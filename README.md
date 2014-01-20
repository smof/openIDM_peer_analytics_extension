<b>Peer Analtics Extension for OpenIDM</b>
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
<b>USAGE -peerAnalysis</b>
<br/>
<b>GET http://server:port/openidm/endpoint/peerAnalysis?sourceSystem=managed/user&sourceAttribute=jobTitle&userAttribute=employeeNumber</b>
<br/>
Args - sourceSystem: the source system that OpenIDM is managing and the system used for mining business roles.  Generally an auth source such as HR, or the managed/user source itself.  sourceAttribute is what the role mining process will analyse.  Generally
something like job title, manager, department or so on.  userAttribute is the unique user attribute used to populate the role object.  Generally something like email, uid etc.
<br/>
Returns - JSON object containing business roles and the users associated with them.  This file can then be saved as a custom endpoint and be read during provisioning.
<br>
<br>
<b>USAGE - peerEntitlements</b>
<br/>
<b>POST http://server:port/openidm/endpoint/peerEntitlements?sourceSystem=AD&sourceAttribute=groups</b>
<br>
Args - sourceSystem: the source system that OpenIDM is going to analyse from an entitlements perspective.  A target system (AD, LDAP, RACF etc).  The mining engine only mines one system at once.  sourceAttribute is the system attribute that contains the entitlements.
<br>
Also requires a JSON payload containing rolename to users (output of createRoles)
<br/>
Returns - JSON object containing the entitlements on a per role basis.
<br>
<br>
<b>USAGE - peerExceptions</b>
<br/>
<b>POST http://server:port/openidm/endpoint/peerExceptions?sourceSystem=AD&sourceAttribute=groups&user=J100000</b>
<br>
Args - sourceSystem: the source system that OpenIDM is going to analyse from an entitlements perspective.  A target system (AD, LDAP, RACF etc).  The mining engine only mines one system at once.  sourceAttribute is the system attribute that contains the entitlements.
user is the userid to analyse.
<br>
Also requires JSON payload containing rolenames and entitlements - output of createRoleEntitlements
<br/>
Returns - JSON object containing the user exceptions - or entitlements assigned to the user natively on the target system, but not found in their associated roles.
