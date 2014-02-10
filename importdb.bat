mongo blankdb_test --eval "db.dropDatabase()"
for /f %%a IN ('dir /b /s "res\dbsample\*.js"') do mongo blankdb_test %%a
