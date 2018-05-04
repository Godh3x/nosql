MATCH  (niceWizard:Wizard {name:"Tom Riddle"})
MATCH (mother:Wizard{name:"Lily Potter"})
CREATE (mother) - [:SAVE] -> (son:Wizard{name:"Harry Potter"})
  - [:SURVIVE] -> (niceWizard)
RETURN niceWizard, mother, son