//Simon Moffatt (C) 2013 - Part of RolesCreator library - https://github.com/smof/openIDM_roles_creator_extension
//Creates role entitlements JSON object that contains role names and de-duped entitlements.
//Only entitlements that are common across ALL users within a particular role object are saved to the roleEntitlementa array
//
//Verb: POST
//Data: JSON of roleNames and array of unique user ID's - see result of createRoles
//Args: sourceSystem - system to analyse. Eg AD or RACF etc
//Args: sourceAttribute - attribute within sourceSystem that contains user entitlements.  Eg memberOf or groups etc

//Returns:
//{"roleName" : ["entitlement1",...,"entitlementN"]}

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
var roleUsers = {}, roleEntitlements = {};

//Pull in args as given via URL
var sourceSystem = request.params['sourceSystem'];
var sourceAttribute = request.params['sourceAttribute'];

//Check that args via URL are actually present
if (sourceSystem == null) {
	
	throw "Missing Arg : sourceSystem";
	
}
if (sourceAttribute == null) {
	
	throw "Missing Arg : sourceAttribute";
	
}



//Pull in data payload
var roleUsers = request.value;

//Iterate over roleUsers and pull out role name and push to roleEntitlements object
for (var role in roleUsers) {
    
	//Pull out users for each role
	var users = roleUsers[role];
	
  	//An array of arrays containing all user entitlements
	var allUserEntitlements = [];
	
	//Iterate over users pulling out entitlements from given system
	for (i=0; i < users.length; i++) {
	
		//Read the user object from the source system
		systemUserObj = openidm.read("system/" + sourceSystem + "/account/" + users[i]) || [];
		
		//Find the sourceAttribute that contains the entitements
		if (systemUserObj) {
		
			
			//Pull out user entitlements from source system
			userEntitlements = systemUserObj[sourceAttribute] || [];
			
			if (userEntitlements.length > 0) {
			
				userEntitlements = userEntitlements[0].split(";"); //Hack when testing using CSV connector
			}
			
			//Add user entitlements to array of all entitlements
			allUserEntitlements.push(userEntitlements);
		}                                                                        
				
	}
	
	//Create role key and value as array of intersected entitlements
	if (allUserEntitlements.length > 0) {
		
		roleEntitlements[role] = arrayIntersection.apply(this,allUserEntitlements);
	}
	else {
		roleEntitlements[role] = allUserEntitlements;
	}
	
}  

//Array intersection function /////////////////////////////////////////////////////////////////////////////////////////////
function arrayIntersection(/* pass all arrays here */) {
    var output = [];
    var cntObj = {};
    var array, item, cnt;
    // for each array passed as an argument to the function
    for (var i = 0; i < arguments.length; i++) {
        array = arguments[i];
        // for each element in the array
        for (var j = 0; j < array.length; j++) {
            item = "-" + array[j];
            cnt = cntObj[item] || 0;
            // if cnt is exactly the number of previous arrays, 
            // then increment by one so we count only one per array
            if (cnt == i) {
                cntObj[item] = cnt + 1;
            }
        }
    }
    // now collect all results that are in all arrays
    for (item in cntObj) {
        if (cntObj.hasOwnProperty(item) && cntObj[item] === arguments.length) {
            output.push(item.substring(1));
        }
    }
    return(output);
} 
//Array intersection function /////////////////////////////////////////////////////////////////////////////////////////////
    

//Return roleEntitlements object 
roleEntitlements;

