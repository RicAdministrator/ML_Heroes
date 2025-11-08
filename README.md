# ML_HEROES

ML_HEROES is a small project that uses VUE, RESTFUL API and MySQL.\
It performs CRUD operations.

## Database
How to Drop Create DB:
1. Open MySQL Workbench
2. Run drop_create_db.sql

## API
How to Run API and Test Endpoints:
1. API > Open in Integrated Terminal > nodemon index
2. Open Postman
3. Test the endpoint calls in API\endpoint_test

## Front End
How to Run the Vue Front End
1. Smadav > Disable Protection (Until Restart)
2. Front_End > Open in Integrated Terminal > npm run dev
3. The Local url should appear, use the url to test the front end

How to Generate and Test Production Files Using Vite:
1. Delete Front_End\dist folder
2. Front_End > Open in Integrated Terminal > npm run build - Vite will output the production build to the dist folder
3. ML_Heroes\Front_End> npx vite preview - This serves the built files from dist so you can test your production build.
4. The Local url should appear, use the url to test the front end
5. When you build your Vue project with Vite (or Webpack), your .vue files are transformed into JavaScript files. These compiled JS files, along with CSS and other assets, are bundled and placed in the dist folder. The original .vue files are not included in the dist folder. Only the optimized, production-ready JS, CSS, and static assets are.
6. When you view the source of the pages, you will notice that the html uses the js and css files in dist\assets folder.

## Selenium
How to Test:
1. Drop create db
2. Run api
3. Run front end
4. Access http://localhost:5173/
5. Make sure the front end loads
6. Selenium > Open in Integrated Terminal
7. npx mocha .\ml_heroes_test.spec.js