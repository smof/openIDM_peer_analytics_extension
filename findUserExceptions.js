//Simon Moffatt (C) 2013 - Part of RolesCreator library - https://github.com/smof/openIDM_roles_creator_extension
//Performs a diff between existing directly associated user entitlements on the target system and those given via a role.  Result is an array of entitlements or 'exceptions' on the target system
//
//Verb: POST
//Data: JSON of roles and users that need analysing - output of createRoles for example
//
//Args: sourceSystem - system to analyse. Eg AD or RACF etc
//Args: sourceAttribute - attribute within sourceSystem that contains user entitlements.  Eg memberOf or groups etc


//Returns:
//{"user" : ["entitlement1",...,"entitlementN"]}

//Logging
logger.info("Endpoint Request {}", request);

//Make sure the request coming in is a action/POST
if (request.method !== "action") {
    throw { 
        "openidmCode" : 403, 
        "message" : "Access denied"
    } 
}

//Variable declarations
var userExceptions = {};

//Pull in args as given via URL
var sourceSystem = request.params['sourceSystem'];
var sourceAttribute = request.params['sourceAttribute'];
var user = request.params['user'];


//Check that args via URL are actually present
if (sourceSystem == null) {
	
	throw "Missing Arg : sourceSystem";
	
}
if (sourceAttribute == null) {
	
	throw "Missing Arg : sourceAttribute";
	
}
if (user == null) {
	
	throw "Missing Arg : user";
	
}


//Pull in data payload
var roles = request.value;

if (roles == null) {
	
	throw "Missing Arg: roleUsers data payload"	
	
}


//Find user on target system
var systemUserObj = openidm.read("system/" + sourceSystem + "/account/" + user); //assumes managed/user object id is same as uid on target system

if (systemUserObj != null) {

	var systemUserEntitlements = systemUserObj[sourceAttribute];

	//Hack to if using CSV connector to split entitlements to array
	systemUserEntitlements = systemUserEntitlements[0].split(";");
}

else {
	throw "User " +user + " not found in " + sourceSystem

}


//Iterate over roles payload, combine entitlements and dedupe
var allRoleEntitlements = [];

for (role in roles) {
	
	roleEntitlements = roles[role];
	for (i=0; i < roleEntitlements.length; i++) {
	
		allRoleEntitlements.push(roleEntitlements[i]);		
	
	}	
	
}

//Dedupe all entitlements given via roles - role effective entitlements
allRoleEntitlements = dedupeArray(allRoleEntitlements);

//Perform array diff between effective entitlements per user and effective entitlements given via roles
exceptions = diffArray(systemUserEntitlements, allRoleEntitlements)

//Populate return object
userExceptions[user + "_Effective_Entitlements"] = systemUserEntitlements;
userExceptions["Roles_Effective_Entitlements"] = allRoleEntitlements;
userExceptions["Exceptions"] = exceptions



//De-dupe Array /////////////////////////////////////////////////////////////////////////////////////////////////////////
function dedupeArray(arr) {
	
	var arr = arr.filter(function (v, i, a) { return a.indexOf (v) == i });	
	return arr
	
}
//De-dupe Array /////////////////////////////////////////////////////////////////////////////////////////////////////////


//Array difference function /////////////////////////////////////////////////////////////////////////////////////////////
function diffArray(a1, a2)
{
  var a=[], diff=[];
  for(var i=0;i<a1.length;i++)
    a[a1[i]]=a1[i];
  for(var i=0;i<a2.length;i++)
    if(a[a2[i]]) delete a[a2[i]];
    else a[a2[i]]=a2[i];
  for(var k in a)
   diff.push(a[k]);
  return diff;
}
//Array difference function /////////////////////////////////////////////////////////////////////////////////////////////
    

//Return roleEntitlements object 
logger.info("Exceptions Returned {}", userExceptions);
userExceptions;

