# Lab 5 - Traccie's Recipe Finder

**[Optional]** If what is being submitted is an individual Lab or Assignment. Otherwise, include a brief one paragraph description about the project.

* *Date Created*: 09 03 2026
* *Last Modification Date*: 15 03 2026
* *Lab URL*: 

CS Gitlab:
https://git.cs.dal.ca/eisenhauer/csci-3172/-/tree/main/Labs/Lab5?ref_type=heads
Personal GitHub:
https://github.com/tracciee/CSCI3172-Lab5
Netlify:
https://tracciesrecipefinder.netlify.app/


## Authors

If what is being submitted is an individual Lab or Assignment, you may simply include your name and email address. Otherwise list the members of your group.

* Traccie Eisenhauer traccie@dal.ca - Author


## Built With

<!--- Provide a list of the frameworks used to build this application, your list should include the name of the framework used, the url where the framework is available for download and what the framework was used for, see the example below --->

* [Bootstrap](https://getbootstrap.com/) - The framework used


## Test Explanation

To test my application, I created unit tests for both my server and frontend scripts. It's important to test the individual functionality of these scripts. For my frontend test, I ensure that the DOM contains
the search input area, as well as the ingredient name input area. For my API test, I am checking the functions of the server. I have one that ensures the Spoonacular API is sending a JSON object back to the server, 
one that ensures a 404 is received if the route is not found, a test that checks a test is returned if the query is not found, and finally a test that ensures there is nothing populating the results array if there is no matches.

To test the functionality of my website, I tested my application across multiple browsers, ensuring functionality between google chrome and firefox. To further ensure the compatibility, I performed the same tests
on the netlify hosting of my website. This ensured a fully functional experience.


