/**
 * CAPS Grade 12 Mathematical Literacy - Annual Teaching Plan (ATP)
 * Source: Department of Basic Education, South Africa
 * Curriculum and Assessment Policy Statement (CAPS)
 *
 * Cognitive Levels (as per CAPS):
 *   L1 - Knowledge        (approximately 30%)
 *   L2 - Routine Procedures (approximately 30%)
 *   L3 - Complex Procedures (approximately 20%)
 *   L4 - Reasoning & Reflecting (approximately 20%)
 *
 * Topics (as per CAPS Mathematical Literacy):
 *   1. Numbers and calculations with numbers
 *   2. Patterns, relationships and representations
 *   3. Finance
 *   4. Measurement
 *   5. Maps, plans and other representations of the physical world
 *   6. Data handling
 *   7. Probability
 */

export const COGNITIVE_LEVELS = {
  L1: {
    code: "L1",
    name: "Knowledge",
    description: "Recall of facts, definitions, and use of formulae",
    capsWeighting: 30, // percentage
  },
  L2: {
    code: "L2",
    name: "Routine Procedures",
    description:
      "Performing well-known procedures, straightforward calculations",
    capsWeighting: 30,
  },
  L3: {
    code: "L3",
    name: "Complex Procedures",
    description:
      "Multi-step procedures, problem-solving in familiar contexts",
    capsWeighting: 20,
  },
  L4: {
    code: "L4",
    name: "Reasoning and Reflecting",
    description:
      "Interpreting, justifying, evaluating, and solving unfamiliar problems",
    capsWeighting: 20,
  },
};

export const TOPICS = {
  NUMBERS: "Numbers and Calculations with Numbers",
  PATTERNS: "Patterns, Relationships and Representations",
  FINANCE: "Finance",
  MEASUREMENT: "Measurement",
  MAPS: "Maps, Plans and Other Representations of the Physical World",
  DATA: "Data Handling",
  PROBABILITY: "Probability",
};

export const ASSESSMENT_TYPES = {
  ASSIGNMENT: "Assignment",
  TEST: "Control Test",
  EXAM: "Examination",
  INVESTIGATION: "Investigation",
  PROJECT: "Project",
};

// Formal Assessment Programme (as per CAPS Grade 12)
export const FORMAL_ASSESSMENT_PROGRAMME = {
  term1: [
    {
      type: ASSESSMENT_TYPES.ASSIGNMENT,
      weight: 10,
      description: "Assignment / Investigation",
    },
    {
      type: ASSESSMENT_TYPES.TEST,
      weight: 10,
      description: "Control Test",
    },
  ],
  term2: [
    {
      type: ASSESSMENT_TYPES.INVESTIGATION,
      weight: 10,
      description: "Investigation / Project",
    },
    {
      type: ASSESSMENT_TYPES.EXAM,
      weight: 25,
      description: "Mid-Year Examination (Paper 1 & 2)",
    },
  ],
  term3: [
    {
      type: ASSESSMENT_TYPES.ASSIGNMENT,
      weight: 10,
      description: "Assignment",
    },
    {
      type: ASSESSMENT_TYPES.TEST,
      weight: 10,
      description: "Control Test",
    },
  ],
  term4: [
    {
      type: ASSESSMENT_TYPES.EXAM,
      weight: 25,
      description: "Trial / Preparatory Examination (Paper 1 & 2)",
    },
  ],
  schoolBasedAssessmentTotal: 25,
  nscExamTotal: 75,
};

// Full ATP structured by Term > Week > Topic > Subtopic
export const ATP = [
  // ─────────────────────────────────────────────────────────────────
  // TERM 1
  // ─────────────────────────────────────────────────────────────────
  {
    term: 1,
    totalWeeks: 10,
    weeks: [
      {
        weekStart: 1,
        weekEnd: 2,
        topic: TOPICS.FINANCE,
        subtopic: "Financial Documents",
        id: "T1_W1_FINANCE_DOCS",
        capsRef: "Finance: Financial documents",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3"],
        description:
          "Interpreting and understanding various financial documents including payslips, invoices, receipts, bank statements, and utility bills.",
        learningOutcomes: [
          "Read and interpret payslips including gross pay, deductions, and net pay",
          "Analyse invoices, receipts, and till slips",
          "Interpret bank statements and identify transactions",
          "Read and understand electricity and water accounts",
          "Calculate VAT (15%) on transactions",
        ],
        misconceptions: [
          {
            misconception: "Confusing gross pay with net pay",
            description:
              "Learners often think gross pay is what they receive, not realising deductions reduce it to net pay.",
            teachingStrategy:
              "Use a real-world payslip simulation. Have learners calculate their own fictional salary after deductions. Create a step-by-step deduction chart.",
          },
          {
            misconception: "Incorrectly applying VAT",
            description:
              "Learners add 15% to VAT-inclusive prices, or confuse VAT-inclusive and VAT-exclusive amounts.",
            teachingStrategy:
              "Use till slips from local shops. Show the difference between VAT-inclusive and exclusive. Use the formula: VAT amount = Price × 15/115 for inclusive prices.",
          },
          {
            misconception: "Misreading bank statements (debits vs credits)",
            description:
              "Learners confuse debit (money out) and credit (money in) entries.",
            teachingStrategy:
              "Use a T-account visual. Role-play a bank account where money goes in and out and track the balance.",
          },
        ],
        teachingMethods: [
          "Document analysis using real or simulated financial documents",
          "Pair work to interpret and discuss documents",
          "Gallery walk with different document types posted around the classroom",
          "Worked examples followed by guided practice",
        ],
        resources: [
          "Sample payslips",
          "Grocery store till slips",
          "Utility bills (Eskom/municipality)",
          "Bank statement examples",
        ],
      },
      {
        weekStart: 3,
        weekEnd: 4,
        topic: TOPICS.FINANCE,
        subtopic: "Tariff Systems",
        id: "T1_W3_FINANCE_TARIFFS",
        capsRef: "Finance: Tariff systems",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3"],
        description:
          "Understanding and working with various tariff systems including water, electricity, telephone, and transport tariffs.",
        learningOutcomes: [
          "Interpret and use fixed and variable tariff structures",
          "Calculate costs using block/stepped tariff systems",
          "Compare different tariff options to determine the most cost-effective",
          "Read and interpret graphs of tariff systems",
        ],
        misconceptions: [
          {
            misconception:
              "Applying the highest block tariff to the entire usage",
            description:
              "Learners apply the rate for the highest usage block to all units consumed, rather than calculating each block separately.",
            teachingStrategy:
              "Use a staircase diagram to illustrate block tariffs. Practice with municipal water tariff tables and work through examples step by step.",
          },
          {
            misconception: "Confusing fixed and variable costs",
            description:
              "Learners don't account for the fixed (basic) charge when calculating a total bill.",
            teachingStrategy:
              "Decompose a bill into fixed + variable components. Use a real electricity bill as a template.",
          },
        ],
        teachingMethods: [
          "Direct instruction with worked examples",
          "Real municipal tariff schedules for analysis",
          "Graph sketching and interpretation",
          "Comparison tasks between two tariff options",
        ],
        resources: [
          "Municipal tariff schedules",
          "Electricity prepaid vs postpaid comparisons",
          "Cellphone contract vs prepaid tariff cards",
        ],
      },
      {
        weekStart: 5,
        weekEnd: 6,
        topic: TOPICS.FINANCE,
        subtopic: "Income, Expenditure, Profit and Loss",
        id: "T1_W5_FINANCE_INCOME",
        capsRef: "Finance: Income, expenditure, profit/loss, income-and-expenditure statements and budgets",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3", "L4"],
        description:
          "Analysing income and expenditure statements, calculating profit and loss, and working with budgets.",
        learningOutcomes: [
          "Distinguish between income and expenditure",
          "Calculate profit and loss",
          "Analyse and interpret income-and-expenditure statements",
          "Prepare and adjust simple budgets",
          "Identify fixed and variable costs in a budget",
        ],
        misconceptions: [
          {
            misconception: "Confusing profit with income",
            description:
              "Learners think profit equals income, ignoring that expenses must be subtracted.",
            teachingStrategy:
              "Use a simple tuck shop scenario. Revenue from sales minus cost of stock = profit. Have learners run a simulated class tuck shop for a week.",
          },
          {
            misconception: "Not distinguishing between fixed and variable expenses in budgets",
            description:
              "Learners treat all expenses as the same, making budget adjustments incorrectly.",
            teachingStrategy:
              "Give learners a household budget. Ask them to identify which costs change with usage and which stay the same.",
          },
        ],
        teachingMethods: [
          "Case study analysis (small business scenarios)",
          "Budget creation tasks",
          "Group discussions on household vs business budgets",
          "Spreadsheet simulation (if technology available)",
        ],
        resources: [
          "Sample income-and-expenditure statements",
          "Small business case studies",
          "Household budget templates",
        ],
      },
      {
        weekStart: 7,
        weekEnd: 8,
        topic: TOPICS.FINANCE,
        subtopic: "Cost Price, Selling Price and Break-Even Analysis",
        id: "T1_W7_FINANCE_BREAKEVEN",
        capsRef: "Finance: Cost price, selling price, break-even analysis",
        duration: "2 weeks",
        cognitiveLevel: ["L2", "L3", "L4"],
        description:
          "Calculating cost price, selling price, percentage mark-up, percentage profit/loss, and determining break-even points.",
        learningOutcomes: [
          "Calculate cost price and selling price",
          "Calculate percentage mark-up and percentage profit or loss",
          "Determine the break-even point graphically and algebraically",
          "Interpret break-even graphs",
          "Make decisions based on break-even analysis",
        ],
        misconceptions: [
          {
            misconception:
              "Calculating percentage profit on selling price instead of cost price",
            description:
              "Learners use the selling price as the base for percentage profit rather than cost price.",
            teachingStrategy:
              "Explicitly teach the formula: % profit = (profit / cost price) × 100. Contrast with % mark-up.",
          },
          {
            misconception: "Misreading the break-even graph",
            description:
              "Learners cannot identify profit/loss regions on the break-even graph.",
            teachingStrategy:
              "Use colour coding on graphs — red for loss region, green for profit region. Have learners shade and label regions themselves.",
          },
        ],
        teachingMethods: [
          "Graph drawing and interpretation activities",
          "Real-world pricing investigations",
          "Worked examples followed by independent practice",
        ],
        resources: [
          "Break-even graph templates",
          "Small business pricing scenarios",
        ],
      },
      {
        weekStart: 9,
        weekEnd: 10,
        topic: TOPICS.MEASUREMENT,
        subtopic: "Measuring Length, Weight, Volume and Temperature",
        id: "T1_W9_MEASURE_BASIC",
        capsRef: "Measurement: Measuring length, weight, volume and temperature",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3"],
        description:
          "Using and converting between units of measurement for length, mass, volume, and temperature in real-world contexts.",
        learningOutcomes: [
          "Convert between metric units of length, mass, and volume",
          "Read measuring instruments (rulers, scales, measuring jugs, thermometers)",
          "Convert between Celsius and Fahrenheit",
          "Solve problems involving measurement in real contexts",
        ],
        misconceptions: [
          {
            misconception: "Incorrectly converting between units",
            description:
              "Learners multiply instead of divide (or vice versa) when converting (e.g. cm to m).",
            teachingStrategy:
              "Create a unit conversion ladder/chart. Always ask: 'Am I going to a bigger or smaller unit?' Bigger unit = divide.",
          },
          {
            misconception: "Confusing mass and weight",
            description:
              "Learners use mass and weight interchangeably in a Mathematical Literacy context.",
            teachingStrategy:
              "Keep it practical — in everyday life we say 'weight' but measure in kg (mass). Accept both terms in context but clarify scientifically.",
          },
        ],
        teachingMethods: [
          "Hands-on measuring activities in the classroom",
          "Real object measurement tasks",
          "Conversion practice with visual aids",
        ],
        resources: [
          "Rulers, measuring tapes",
          "Kitchen scale",
          "Measuring jugs",
          "Thermometer",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // TERM 2
  // ─────────────────────────────────────────────────────────────────
  {
    term: 2,
    totalWeeks: 9,
    weeks: [
      {
        weekStart: 1,
        weekEnd: 2,
        topic: TOPICS.MEASUREMENT,
        subtopic: "Perimeter, Area and Volume",
        id: "T2_W1_MEASURE_PAV",
        capsRef: "Measurement: Perimeter, area and volume",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3"],
        description:
          "Calculating perimeter, area, and volume of 2D and 3D shapes in real-world contexts including packaging, fencing, and tiling.",
        learningOutcomes: [
          "Calculate perimeter of regular and irregular shapes",
          "Calculate area of rectangles, triangles, circles, and composite shapes",
          "Calculate volume of rectangular prisms, cylinders, and triangular prisms",
          "Convert between units of area and volume",
          "Solve real-world problems involving perimeter, area, and volume",
        ],
        misconceptions: [
          {
            misconception: "Confusing perimeter and area",
            description:
              "Learners add all sides for area, or multiply dimensions for perimeter.",
            teachingStrategy:
              "Perimeter = fence around the garden (one-dimensional). Area = carpet inside the room (two-dimensional). Use physical classroom objects to measure both.",
          },
          {
            misconception: "Incorrect unit conversion for area and volume",
            description:
              "Learners apply linear conversion factors to area (e.g. 1 m² = 100 cm² instead of 10 000 cm²).",
            teachingStrategy:
              "Draw a 1m × 1m square and subdivide it into centimetres. Count how many cm² fit. Visual proof is more powerful than the formula alone.",
          },
          {
            misconception: "Using diameter instead of radius in circle formulas",
            description:
              "Learners substitute the diameter directly into A = πr² without halving it.",
            teachingStrategy:
              "Always circle (r) on diagrams before substituting. Make 'identify r first' a classroom routine.",
          },
        ],
        teachingMethods: [
          "Hands-on measuring and calculating tasks (classroom furniture, school grounds)",
          "Tiling and packaging design projects",
          "Worked examples with annotated diagrams",
        ],
        resources: [
          "Graph paper for area estimation",
          "Real containers for volume",
          "Floor tile samples",
        ],
      },
      {
        weekStart: 3,
        weekEnd: 4,
        topic: TOPICS.MAPS,
        subtopic: "Maps and Scale",
        id: "T2_W3_MAPS_SCALE",
        capsRef: "Maps, plans and other representations: Maps and scale",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3"],
        description:
          "Working with maps, understanding scale, calculating actual distances from map distances, and interpreting map features.",
        learningOutcomes: [
          "Interpret and use map scales (bar scale and ratio scale)",
          "Calculate actual distances using a given scale",
          "Determine map distances from actual distances",
          "Read and interpret different types of maps (street, road, national)",
          "Use a compass rose and grid references",
        ],
        misconceptions: [
          {
            misconception:
              "Incorrectly applying ratio scales (e.g. 1:50 000)",
            description:
              "Learners don't convert units when using ratio scales, leading to incorrect actual distances.",
            teachingStrategy:
              "Always write out the unit: 1 cm on map = 50 000 cm in real life. Then convert 50 000 cm to km. Make unit conversion part of the routine.",
          },
          {
            misconception: "Confusing bar scale with ratio scale",
            description:
              "Learners try to use the bar scale like a ratio scale and vice versa.",
            teachingStrategy:
              "Teach each scale type separately with dedicated examples before mixing them.",
          },
        ],
        teachingMethods: [
          "Map reading activities using real South African road maps",
          "Google Maps / printed local area maps",
          "Measurement with ruler on maps",
          "Town planning discussions",
        ],
        resources: [
          "Road atlas or printed maps",
          "Rulers",
          "Local area/street maps",
        ],
      },
      {
        weekStart: 5,
        weekEnd: 6,
        topic: TOPICS.MAPS,
        subtopic: "Plans and Representations",
        id: "T2_W5_MAPS_PLANS",
        capsRef: "Maps, plans and other representations: Plans (floor plans, elevation plans, seating plans)",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3", "L4"],
        description:
          "Reading and interpreting floor plans, elevation plans, seating arrangements, and packing diagrams.",
        learningOutcomes: [
          "Read and interpret floor plans and building plans",
          "Identify and use symbols and keys on plans",
          "Calculate actual dimensions from plans using scale",
          "Determine quantities of materials from plans (e.g. tiles, paint, carpet)",
          "Interpret seating plans and packing diagrams",
        ],
        misconceptions: [
          {
            misconception:
              "Not accounting for waste/overlap when calculating materials",
            description:
              "Learners calculate the exact area and assume that is the exact amount of material needed, not accounting for offcuts or overlap.",
            teachingStrategy:
              "Introduce a 10% waste factor concept. Discuss why builders and tilers always buy extra. Practical example: tile a bathroom floor.",
          },
        ],
        teachingMethods: [
          "Floor plan drawing activities",
          "Material quantity estimation tasks",
          "Comparing floor plan to a physical space",
        ],
        resources: [
          "Sample building/floor plans",
          "Graph paper",
          "Ruler and pencils",
        ],
      },
      {
        weekStart: 7,
        weekEnd: 9,
        topic: TOPICS.DATA,
        subtopic: "Collecting and Organising Data",
        id: "T2_W7_DATA_COLLECT",
        capsRef: "Data handling: Collecting and organising data",
        duration: "3 weeks",
        cognitiveLevel: ["L1", "L2", "L3"],
        description:
          "Classifying data, designing data collection tools, and organising data into frequency tables and stem-and-leaf plots.",
        learningOutcomes: [
          "Distinguish between quantitative and qualitative data",
          "Distinguish between discrete and continuous data",
          "Design questionnaires and tally tables",
          "Organise data in frequency tables",
          "Construct stem-and-leaf plots",
          "Identify appropriate data collection methods",
        ],
        misconceptions: [
          {
            misconception:
              "Confusing discrete and continuous data",
            description:
              "Learners classify shoe size as continuous because it can be 8.5, or height as discrete because it is a whole number on a chart.",
            teachingStrategy:
              "Discrete = countable (shoes you own). Continuous = measured on a scale (your height). Use a sorting activity with data cards.",
          },
          {
            misconception: "Poor questionnaire design — leading questions",
            description:
              "Learners write questions that suggest the desired answer, invalidating the data.",
            teachingStrategy:
              "Analyse real examples of good and bad survey questions. Have learners critique and rewrite leading questions.",
          },
        ],
        teachingMethods: [
          "Class surveys and data collection activities",
          "Peer critique of questionnaire designs",
          "Data sorting and organising tasks",
        ],
        resources: [
          "Survey templates",
          "Data sets for organising",
          "Stem-and-leaf worksheets",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // TERM 3
  // ─────────────────────────────────────────────────────────────────
  {
    term: 3,
    totalWeeks: 9,
    weeks: [
      {
        weekStart: 1,
        weekEnd: 3,
        topic: TOPICS.DATA,
        subtopic: "Summarising and Displaying Data",
        id: "T3_W1_DATA_DISPLAY",
        capsRef: "Data handling: Summarising and displaying data",
        duration: "3 weeks",
        cognitiveLevel: ["L1", "L2", "L3", "L4"],
        description:
          "Calculating and interpreting measures of central tendency and spread. Drawing and interpreting various statistical graphs.",
        learningOutcomes: [
          "Calculate mean, median, mode, and range",
          "Interpret measures of central tendency in context",
          "Draw and interpret bar graphs, double bar graphs, and histograms",
          "Draw and interpret line graphs and broken-line graphs",
          "Draw and interpret pie charts",
          "Draw and interpret box-and-whisker plots",
          "Identify the five-number summary (min, Q1, median, Q3, max)",
        ],
        misconceptions: [
          {
            misconception:
              "Finding the median without ordering data first",
            description:
              "Learners identify the middle value without first arranging data in ascending order.",
            teachingStrategy:
              "Always make 'arrange the data' step 1. Use a mnemonic: 'Sort, then spot the middle.'",
          },
          {
            misconception: "Confusing bar graphs and histograms",
            description:
              "Learners draw bars with gaps for continuous data (histogram) or no gaps for categorical data (bar graph).",
            teachingStrategy:
              "Bar graph = categories (gaps between bars). Histogram = continuous data (no gaps). Use different coloured pens for each type.",
          },
          {
            misconception: "Misidentifying outliers on box-and-whisker plots",
            description:
              "Learners don't know how to identify outliers or confuse whiskers with outliers.",
            teachingStrategy:
              "Use a step-by-step five-number summary scaffold. Draw the box plot on a number line to make it visual.",
          },
        ],
        teachingMethods: [
          "Class data collection followed by full statistical analysis",
          "Graph construction by hand (important for understanding)",
          "Interpreting pre-drawn graphs in context",
          "Comparing two data sets using back-to-back stem-and-leaf or double bar graphs",
        ],
        resources: [
          "Graph paper",
          "Real data sets (sports, weather, population)",
          "Rulers and protractors for pie charts",
        ],
      },
      {
        weekStart: 4,
        weekEnd: 5,
        topic: TOPICS.DATA,
        subtopic: "Interpreting and Analysing Data",
        id: "T3_W4_DATA_ANALYSE",
        capsRef: "Data handling: Interpreting and analysing data",
        duration: "2 weeks",
        cognitiveLevel: ["L3", "L4"],
        description:
          "Critically interpreting statistical representations, identifying misleading statistics, and making informed decisions from data.",
        learningOutcomes: [
          "Critically evaluate statistical claims and representations",
          "Identify misleading graphs and statistics",
          "Compare data sets and draw conclusions",
          "Make predictions and decisions based on data",
          "Identify bias in data collection and representation",
        ],
        misconceptions: [
          {
            misconception:
              "Accepting statistical representations at face value",
            description:
              "Learners believe all graphs and statistics without questioning the scale, sample, or source.",
            teachingStrategy:
              "Show examples of manipulated graphs (truncated y-axis, misleading 3D pie charts). Ask 'Who benefits from this representation?' as a critical question.",
          },
        ],
        teachingMethods: [
          "Newspaper/media analysis of statistical claims",
          "Debate — arguing for and against a data-based claim",
          "Create a misleading graph, then fix it",
        ],
        resources: [
          "Newspaper articles with statistics",
          "Advertisements with statistical claims",
          "Social media infographics",
        ],
      },
      {
        weekStart: 6,
        weekEnd: 7,
        topic: TOPICS.PROBABILITY,
        subtopic: "Probability",
        id: "T3_W6_PROBABILITY",
        capsRef: "Probability",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3", "L4"],
        description:
          "Understanding and calculating probability using relative frequency and theoretical probability in real-world contexts.",
        learningOutcomes: [
          "Express probability as a fraction, decimal, and percentage",
          "Calculate theoretical probability of single events",
          "Calculate relative frequency from experimental data",
          "Compare theoretical and experimental probability",
          "Use probability in real-life contexts (weather, insurance, games)",
          "Solve problems involving complementary events",
        ],
        misconceptions: [
          {
            misconception:
              "Gambler's fallacy — believing previous outcomes affect future independent events",
            description:
              "Learners think if heads comes up 5 times, tails is 'due' to come up.",
            teachingStrategy:
              "Coin-flipping experiment in class. Record results and show that each flip is independent. Connect to insurance and weather forecasting.",
          },
          {
            misconception:
              "Confusing probability of 0 and 1",
            description:
              "Learners think probability of 1 means 100% certain but 0 means 'very unlikely' rather than impossible.",
            teachingStrategy:
              "Use a probability scale from 0 to 1. Place real-world events on the scale: 'Sun rising tomorrow' = 1. 'Snow in Limpopo in summer' ≈ 0.",
          },
        ],
        teachingMethods: [
          "Experiments with dice, coins, and spinners",
          "Real-world probability contexts (weather, lotto, sport)",
          "Relative frequency experiments and comparison to theory",
        ],
        resources: [
          "Dice, coins, playing cards",
          "Spinners",
          "Probability scale poster",
        ],
      },
      {
        weekStart: 8,
        weekEnd: 9,
        topic: TOPICS.FINANCE,
        subtopic: "Taxation and Financial Calculations",
        id: "T3_W8_FINANCE_TAX",
        capsRef: "Finance: Taxation (personal income tax, VAT)",
        duration: "2 weeks",
        cognitiveLevel: ["L2", "L3", "L4"],
        description:
          "Understanding personal income tax, tax tables, tax rebates, and completing a simplified income tax return.",
        learningOutcomes: [
          "Read and interpret the SARS tax tables",
          "Calculate income tax using the tax tables",
          "Apply tax rebates (primary, secondary, tertiary)",
          "Understand the difference between taxable income and gross income",
          "Calculate UIF contributions",
          "Understand VAT and its implications for consumers",
        ],
        misconceptions: [
          {
            misconception:
              "Applying the tax percentage to the full income rather than using the tax table correctly",
            description:
              "Learners take the bracket percentage and apply it to all taxable income instead of using the base amount + percentage on the remainder.",
            teachingStrategy:
              "Break down the SARS tax table row by row. Use a worked example showing the base amount + calculation on excess. Scaffold with a template.",
          },
          {
            misconception: "Forgetting to apply tax rebates",
            description:
              "Learners calculate tax owed but don't subtract the primary rebate.",
            teachingStrategy:
              "Create a 4-step tax calculation poster: 1) Calculate tax from table, 2) Subtract rebate, 3) Add medical credits if applicable, 4) Calculate monthly tax.",
          },
        ],
        teachingMethods: [
          "SARS tax table analysis",
          "Scaffolded tax calculation worksheets",
          "Case studies with different income scenarios",
          "Comparison of formal vs informal employment tax implications",
        ],
        resources: [
          "Current SARS tax tables",
          "Simplified IRP5 forms",
          "Tax calculation template/scaffold",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // TERM 4
  // ─────────────────────────────────────────────────────────────────
  {
    term: 4,
    totalWeeks: 8,
    weeks: [
      {
        weekStart: 1,
        weekEnd: 3,
        topic: TOPICS.FINANCE,
        subtopic: "Interest, Banking and Investment",
        id: "T4_W1_FINANCE_INTEREST",
        capsRef: "Finance: Simple and compound interest, banking and investment",
        duration: "3 weeks",
        cognitiveLevel: ["L1", "L2", "L3", "L4"],
        description:
          "Calculating simple and compound interest, comparing savings and loan options, and understanding banking products.",
        learningOutcomes: [
          "Calculate simple interest using A = P(1 + in)",
          "Calculate compound interest using A = P(1 + i)^n",
          "Compare simple and compound interest over time",
          "Understand and compare savings accounts, fixed deposits, and investments",
          "Calculate loan repayments and understand hire purchase",
          "Interpret and use exchange rates",
        ],
        misconceptions: [
          {
            misconception:
              "Confusing simple and compound interest formulas",
            description:
              "Learners use A = P(1 + in) for compound scenarios or forget the exponent in compound interest.",
            teachingStrategy:
              "Side-by-side worked example: same P, i, and n applied using both formulas. Show how compound interest grows faster using a table over 5 years.",
          },
          {
            misconception:
              "Using the annual rate without converting for monthly/quarterly periods",
            description:
              "Learners use an annual interest rate with n = number of months without converting the rate or period.",
            teachingStrategy:
              "Always explicitly state: 'Annual rate ÷ 12 for monthly. Number of years × 12 for monthly n.' Build this into a formula scaffold.",
          },
        ],
        teachingMethods: [
          "Comparison tables — simple vs compound over time",
          "Bank product analysis (real bank websites/brochures)",
          "Hire purchase vs cash price comparison tasks",
          "Exchange rate practical tasks (planning a trip abroad)",
        ],
        resources: [
          "Bank brochures and account comparison tables",
          "SARS and NCR information",
          "Exchange rate tables",
          "Scientific calculators",
        ],
      },
      {
        weekStart: 4,
        weekEnd: 5,
        topic: TOPICS.PATTERNS,
        subtopic: "Patterns and Relationships",
        id: "T4_W4_PATTERNS",
        capsRef: "Patterns, relationships and representations",
        duration: "2 weeks",
        cognitiveLevel: ["L1", "L2", "L3", "L4"],
        description:
          "Identifying and extending patterns, working with linear and inverse proportion relationships, and interpreting graphs.",
        learningOutcomes: [
          "Identify and extend numeric and geometric patterns",
          "Recognise and work with direct proportion relationships",
          "Recognise and work with inverse proportion relationships",
          "Represent relationships in tables, equations, and graphs",
          "Interpret and draw graphs in context",
        ],
        misconceptions: [
          {
            misconception:
              "Assuming all relationships are linear/direct proportion",
            description:
              "Learners extend inverse proportion tables incorrectly, doubling output when input doubles.",
            teachingStrategy:
              "Use the 'more workers, less time' analogy. Build a table for both direct and inverse proportion side by side. Identify the key difference.",
          },
          {
            misconception:
              "Misinterpreting broken-line graphs (confusing slope with value)",
            description:
              "Learners read the height of the graph (value) as the rate of change (slope).",
            teachingStrategy:
              "Use distance-time graphs. A flat line = not moving (zero speed). Steep line = fast. Explicitly link slope to rate of change in context.",
          },
        ],
        teachingMethods: [
          "Pattern building with physical objects",
          "Table-to-graph-to-equation linking activities",
          "Real-life graph interpretation tasks (fuel consumption, distance-time)",
        ],
        resources: [
          "Graph paper",
          "Physical pattern blocks",
          "Real-world graphs from media",
        ],
      },
      {
        weekStart: 6,
        weekEnd: 8,
        topic: TOPICS.NUMBERS,
        subtopic: "Numbers and Operations in Context",
        id: "T4_W6_NUMBERS",
        capsRef: "Numbers and calculations with numbers",
        duration: "3 weeks (revision and integration)",
        cognitiveLevel: ["L1", "L2", "L3", "L4"],
        description:
          "Revision and consolidation of number operations, ratios, rates, percentages, and estimation in real-world contexts. Integration of all topics in preparation for final examination.",
        learningOutcomes: [
          "Perform calculations with integers, fractions, decimals, and percentages",
          "Work with ratios and rates in context",
          "Estimate and check reasonableness of answers",
          "Use a calculator efficiently and correctly",
          "Apply number skills across all ML contexts",
        ],
        misconceptions: [
          {
            misconception:
              "Not checking whether answers are reasonable",
            description:
              "Learners accept calculator answers without checking if they make sense in context (e.g. negative time, more than 100% probability).",
            teachingStrategy:
              "Estimation before calculation habit. 'What do I expect the answer to be roughly?' Teach error-checking as part of every solution.",
          },
          {
            misconception:
              "Confusing ratio and fraction",
            description:
              "Learners write a ratio of 3:5 as 3/5 and use it as a fraction of the whole rather than a part-to-part comparison.",
            teachingStrategy:
              "Ratio 3:5 means 3 parts + 5 parts = 8 parts total. If sharing in ratio 3:5, the fraction of the whole is 3/8 and 5/8. Use sharing exercises.",
          },
        ],
        teachingMethods: [
          "Mixed revision and past paper practice",
          "Peer teaching — learners explain to each other",
          "Timed exam-style practice",
          "Error analysis of common mistakes",
        ],
        resources: [
          "Past NSC Mathematical Literacy papers",
          "Calculator",
          "Formula sheet",
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────

/**
 * Get all topics for a specific term
 */
export function getTopicsForTerm(termNumber) {
  const term = ATP.find((t) => t.term === termNumber);
  return term ? term.weeks : [];
}

/**
 * Get a specific topic by its ID
 */
export function getTopicById(id) {
  for (const term of ATP) {
    const found = term.weeks.find((w) => w.id === id);
    if (found) return { ...found, term: term.term };
  }
  return null;
}

/**
 * Get all topics that have been marked as taught (based on tracker state)
 * @param {Object} trackerState - { topicId: boolean }
 */
export function getTaughtTopics(trackerState) {
  const taught = [];
  for (const term of ATP) {
    for (const week of term.weeks) {
      if (trackerState[week.id]) {
        taught.push({ ...week, term: term.term });
      }
    }
  }
  return taught;
}

/**
 * Get overall progress percentage
 */
export function getOverallProgress(trackerState) {
  const totalTopics = ATP.reduce((sum, term) => sum + term.weeks.length, 0);
  const taught = Object.values(trackerState).filter(Boolean).length;
  return Math.round((taught / totalTopics) * 100);
}

/**
 * Get progress for a specific term
 */
export function getTermProgress(termNumber, trackerState) {
  const term = ATP.find((t) => t.term === termNumber);
  if (!term) return 0;
  const taught = term.weeks.filter((w) => trackerState[w.id]).length;
  return Math.round((taught / term.weeks.length) * 100);
}

/**
 * Get cognitive level distribution for an array of topics
 * Used for generating cognitive level summary tables for assessments
 */
export function getCognitiveLevelSummary(topicIds) {
  const summary = { L1: 0, L2: 0, L3: 0, L4: 0 };
  const topics = topicIds.map((id) => getTopicById(id)).filter(Boolean);
  topics.forEach((topic) => {
    topic.cognitiveLevel.forEach((level) => {
      if (summary[level] !== undefined) summary[level]++;
    });
  });
  return summary;
}

export default ATP;
