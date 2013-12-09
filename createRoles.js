//Simon Moffatt (C) 2013 - Part of RolesCreator library
//Creates business role JSON object that contains role names and unique user identifier

roleNames = [];
roles = {};

//Pull in args
sourceSystem = request.params['sourceSystem'];
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
