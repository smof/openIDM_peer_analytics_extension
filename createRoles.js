//Simon Moffatt (C) 2013 - Part of RolesCreator library - https://github.com/smof/openIDM_roles_creator_extension
//Creates shell role JSON object that contains role names and unique user identifiers in an array.
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
var roles = {};

//Pull in args given via URL
sourceSystem = request.params['sourceSystem'] || "managed/user"; //default to managed/user
sourceAttribute = request.params['sourceAttribute'];
userAttribute = request.params["userAttribute"];

//Query
//users = openidm.query("managed/user", { "_queryId" : "query-all"});
users = openidm.query(sourceSystem, { "_queryId" : "query-all"});

//Get a list of unique role names based on chosen system attribute ///////////////////////////////////////////////////////////////////////////////////

//iterate over user query
for(i=0; i < users.result.length; i++) {
  
  //pull out all titles and send to array
  roleNames.push(users.result[i][sourceAttribute]);
    
};

//de-dupe array
roleNames = roleNames.filter(function (v, i, a) { return a.indexOf (v) == i });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Find all users that match the business role attribute and pump to businessRoles object//////////////////////////////////////////////////////////////


//push role names as keys in businessRoles object
for(i=0; i < roleNames.length; i++) {
    
  roleName = roleNames[i];
  roles[roleName] = [];
    
};

//iterate over users and push out employeeid into value for roleName key
for(role in roles) {
  
	//Iterate over all users (is this efficient?)
	for(i=0; i < users.result.length; i++) {
  
		if (users.result[i][sourceAttribute] === role) {
			
			roles[role].push(users.result[i][userAttribute]);
			
		} //end if
		
	}; //end for
	
}; //end for


//return obj
roles;
