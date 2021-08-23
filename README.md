<h4 align="center">
  Covid-19 Vaccine Tracker Website | Thailand (Unofficial)
</h4>

## Features
- Vaccination goal
- Vaccination progress
- Vaccine manufacturers
- Vaccine allocation

### Coming soon
- Vaccine by province

## Data
Vaccine data are extracted from DDC (Department of Disease Control) daily briefing PDFs.
Otherwise, the data is manually input into the JSON with scripts to update other data.
Data is stored in [Twitter bot repo](https://github.com/nathakits/covid-tracker-twitter-bot)

Other data used are from Dylan Jay's COVID Thailand and The Researcher repos.

### MOPH dashboards
- https://dashboard-vaccine.moph.go.th/
- https://ddc.moph.go.th/covid19-dashboard/

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Testing
### Test Twitter meta tag
Use LocalTunnel

```bash

npx localtunnel --port 3000
```

## Support
If this project is helpful to you, please help support this project.
- https://ko-fi.com/nathakits

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Disclaimer
Data offered here is offered as is with no guarentees.
Attempts are made to retrieve data from aforementioned sources everyday but is not guaranteed to be up to date.
If you would like to report any issues or request features please contact me via email.
No affiliation with any government entity.

## Credit
- https://github.com/djay/covidthailand
- https://github.com/porames/the-researcher-covid-data