# Onboard Assignment

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/XciciciX/Onboard_Web.git
   cd your-project
   ```

1. Install dependencies:

```sh
pnpm install
```

2. Start the dev server:

```sh
pnpm dev
```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

### Development Process

My development process followed an iterative approach, focusing on building a robust persona management system with advanced filtering capabilities. I did not implement the search result (numebrs of contacts found in persona and authority). Instead, I add a function to generate random numebrs if any change is made in fitlers. To implement it in reality, this function should be connected to our database and do search algorithm. 

I mocked data from the screenshots. I created api for CRUD for filters in both persona and authority levels. I did not use any database. I used list for data recording.

I used Next.js App Router for its modern architecture and server component support.

For UI, I used the template from https://vercel.com/templates/next.js/app-directory.



### Link Prioritization Methodology



1. **Hierarchical Organization**
   - Each persona/authority level can have multiple filter groups
   - Each filter group contains multiple filters
   - Filter groups can use either 'AND' or 'OR' operators between filters

2. **Contact Scoring**
   - The system generates random contact counts (between 10,000 and 500,000)
   - Contact counts update when filters change
   

3. **Filtering Types**
   - Title-based filtering
   - Department-based filtering
   - Multiple operator types (Contains, Equals, Starts with, Ends with)

4. **UI Management**

### API Documentation

#### Personas API

**GET /api/personas**
- Retrieves all personas with their filter groups and estimated contact counts
- Response includes persona details, filter groups, and contact estimates

**POST /api/personas**
- Creates a new persona
- Request body requires title and optional key
- Returns the newly created persona object

**PUT /api/personas/:id**
- Updates an existing persona
- Request body can include title and key updates
- Returns the updated persona object

**DELETE /api/personas/:id**
- Deletes a persona
- Returns success confirmation

#### Filter Groups API

**POST /api/personas/:id/filter-groups**
- Creates a new filter group for a persona
- Request body includes logical operator (AND/OR)
- Returns updated persona with new filter group

**PUT /api/personas/:id/filter-groups/:groupId**
- Updates a filter group's properties
- Request body includes updated operator
- Returns updated persona object

**DELETE /api/personas/:id/filter-groups/:groupId**
- Deletes a filter group
- Returns updated persona object

#### Filters API

**POST /api/personas/:id/filters**
- Adds a filter to a persona's filter group
- Request body includes filter type, operator, value, and group ID
- Returns updated persona object

**PUT /api/personas/:id/filters/:filterId**
- Updates a filter's properties
- Request body includes updated type, operator, and value
- Returns updated persona object

**DELETE /api/personas/:id/filters/:filterId**
- Deletes a filter
- Returns updated persona object

