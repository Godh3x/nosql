CREATE (niceWizard:Wizard {name:"Tom Riddle"})
RETURN niceWizard

MATCH  (niceWizard:Wizard {name:"Tom Riddle"})
CREATE (niceWizard)-[friend:Friend]->(pet:Pet {name:"Nagini" })
RETURN niceWizard,friend,pet

MATCH (niceWizard:Wizard {name:"Tom Riddle"})
FOREACH (name in ["James Potter", "Lily Potter", "Bertha Jorkins",
    "Frank Bryce", "Dorcas Meadowes", "Amelia Bones",
    "Charity Burbage", "Alastor Moody", "Gregorovitch",
    "Gellert Grindelwald"] |
  CREATE (niceWizard)-[:KILLED]->(:Wizard{name:name}))