//Simon Moffatt (C) 2013 - Part of Peer Analytics library - https://github.com/smof/openIDM_peer_analytics_extension
//Creates shell grouping JSON object that contains role / peer grouping names and unique user identifiers in an array.
//
//Verb: GET
//Args: sourceSystem - system to analyse (currently managed/user)
//Args: sourceAttribute - attribute within sourceSystem that contains functional grouping.  Eg jobTitle
//Args: userAttribute - unique user attribute within sourceSystem that will be used to populate user array.  Eg _id
//
//Returns:
//{"roleName" : ["user1",...,"userN"]}

//Logging
logger.info("Endpoint Request {}", request);

//Make sure the request coming in is a read/GET
if (request.method !== "query") {
    throw { 
        "openidmCode" : 403, 
        "message" : "Access denied"
    } 
}

//Variable declaration
var roleNames = [];
var peerAnalysis = {};

//Pull in args given via URL
sourceSystem = request.params['sourceSystem'] || "managed/user"; //default to managed/user
sourceAttribute = request.params['sourceAttribute'];
userAttribute = request.params["userAttribute"];

//Check that args via URL are actually present
if (sourceAttribute == null) {
	
	throw "Missing Arg : sourceAttribute";
	
}
if (userAttribute == null) {
	
	throw "Missing Arg : userAttribute";
	
}




//Query
users = openidm.query(sourceSystem, { "_queryId" : "query-all"});

//Get a list of unique role names based on chosen system attribute ///////////////////////////////////////////////////////////////////////////////////

//iterate over user query
for(i=0; i < users.result.length; i++) {
  
  //pull out all titles and send to array
  roleNames.push(users.result[i][sourceAttribute]);
    
};

//de-dupe array
roleNames = roleNames.filter(function (v, i, a) { return a.indexOf (v) == i });

logger.info("Roles Named {}",roleNames);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Find all users that match the business role attribute and pump to businessRoles object//////////////////////////////////////////////////////////////

//Push role names as keys in businessRoles object
for(i=0; i < roleNames.length; i++) {
    
  roleName = roleNames[i];
  peerAnalysis[roleName] = [];
    
};

//iterate over users and push out employeeid into value for roleName key
for(role in peerAnalysis) {
  
	//Iterate over all users (is this efficient?)
	for(i=0; i < users.result.length; i++) {
  
		if (users.result[i][sourceAttribute] === role) {
			
			peerAnalysis[role].push(users.result[i][userAttribute]);
			
		} //end if
		
	}; //end for
	
}; //end for


//return obj
logger.info("Roles returned {}",peerAnalysis);
peerAnalysis;

