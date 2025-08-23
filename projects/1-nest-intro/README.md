# issues

## new line issue

1. my system is windows and after creating the project, i have got this error in each file:
   Delete `␍`eslintprettier/prettier

2. currently, my solution is:
   add "endOfLine": "lf" in .prettierrc file;
   in the current project, run: pnpm format

## git issue

1. using nest new command to create a new project, it will automatically create a git repository, but we're using monorepo, so we need to delete the .git folder in the project;
2. switch to the root folder and execute: git add projects/1-nest-intro/
