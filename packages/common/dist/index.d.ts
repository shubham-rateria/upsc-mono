declare const gs1Categories: {
    categories: ({
        'Art and culture': {
            'Indian Art Forms': {
                'Indian Paintings': string[];
                'Dances in India': string[];
                Music: string[];
                Puppetry: string[];
                Pottery: string[];
                'Drama/Theatre': string[];
                'Martial Arts': string[];
                'Visual Art': string[];
                'Bhakti & Sufi Movements': string[];
            };
            Literature: {
                'Classical Sanskrit Literature': string[];
                'Ancient Buddhist Literature': never[];
                'Ancient Jainism Literature': never[];
                'Early Dravidian Literature (eg Sangam Period)': never[];
                'Medieval Literature': never[];
                'Trends in Medieval Literature': never[];
                'Modern Indian Literature': never[];
            };
            Architecture: {
                'Harappan Architecture': never[];
                'Mauryan Architecture': never[];
                'Post-Mauryan Period Gupta Period': never[];
                'Temple Architecture': string[];
                'Cave Architecture': string[];
                'Medieval and Indo-Islamic Architecture': string[];
                'Colonial Architecture & Modern Architecture': string[];
                'Contribution of Buddhism & Jainism to the Development of Indian Architecture': never[];
                'Rock Cut Architecture': string[];
            };
        };
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'Ancient History': {
            'Pre-Historic': string[];
            'Indus Valley Civilization (IVC)': string[];
            'Vedic Society': string[];
            'Pre-Mauryan Period': string[];
            'Jainism and Buddhism': string[];
            'Mauryan Empire': string[];
            'Post-Mauryan India': string[];
        };
        'Art and culture'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'Medieval History': {
            'Delhi Sultanate': string[];
            'Struggle for Empire in North India (Afghans, Rajputs and Mughals)': never[];
            Mughals: string[];
            'Sur Dynasties': never[];
            'Maratha Empire': never[];
            'Deccan Sultanate': string[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'Modern History': {
            'Important Modern History Events Before 1857': string[];
            'Revolt of 1857': string[];
            'Growth of Nationalism in India (1858-1905)': string[];
            'Growth of Militant Nationalism & Revolutionary Activities (1905-1918)': string[];
            'Beginning of Mass Nationalism (1919-1939)': string[];
            'Towards Freedom & Partition (1939-1947)': string[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'Post-independence India': {
            'Nation Building': (string | {
                'Linguistic Regionalism in India': never[];
            })[];
            'Foreign Policy': string[];
            Economy: string[];
            Polity: string[];
            Social: (string | {
                'Indian Women Since Independence': string[];
            })[];
            'Post-Independence Policy of Science And Technology': string[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'World History': {
            'Beginning of the Modern World': (string | {
                'American War of Independence': string[];
                'French Revolution'?: undefined;
                'Nationalism in Europe'?: undefined;
                'Rise of Capitalism, Colonialism & Imperialism'?: undefined;
            } | {
                'French Revolution': string[];
                'American War of Independence'?: undefined;
                'Nationalism in Europe'?: undefined;
                'Rise of Capitalism, Colonialism & Imperialism'?: undefined;
            } | {
                'Nationalism in Europe': string[];
                'American War of Independence'?: undefined;
                'French Revolution'?: undefined;
                'Rise of Capitalism, Colonialism & Imperialism'?: undefined;
            } | {
                'Rise of Capitalism, Colonialism & Imperialism': string[];
                'American War of Independence'?: undefined;
                'French Revolution'?: undefined;
                'Nationalism in Europe'?: undefined;
            })[];
            'World War I': (string | {
                'Russian Revolution': string[];
            })[];
            'World Between the Two Wars': string[];
            'World War II': string[];
            'Decolonialisation & Redrawal of National Boundaries': string[];
            'Concept, Types & Social Impact of Political Philosophies': string[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'Indian Society': {
            'Salient features of Indian Society, Diversity of India': string[];
            'Role of Women and Women\u2019s Organization': (string | {
                "19th Century Social Reform Movements and Early Women's Organisations": string[];
            })[];
            'Population and Associated Issues': string[];
            'Poverty and Developmental Issues': (string | {
                'Consequences of Poverty': string[];
            })[];
            'Urbanization, their problems and their remedies': string[];
            'Effects of Globalization on Indian society': string[];
            'Social Empowerment': string[];
            Communalism: string[];
            Regionalism: string[];
            Secularism: string[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'World and Indian Geography': {
            Geomorphology: string[];
            Oceanography: string[];
            Climatology: string[];
            'Soil Geography': string[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'Distribution of Key Natural Resources across the world': {
            'Types of Resources': string[];
            'Land Resources': string[];
            'Forest Resources': string[];
            'Water Resources': string[];
            'Agricultural Resources': string[];
            'Mineral & Energy Resources': string[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world': {
            'Classification of Industries': never[];
            'Location & Distribution of the Industries on the Basis of': string[];
            'Distribution of Major Industries \u2013 Iron & Steel, IT, Cotton Textile': never[];
            'Agglomeration & Footloose Industries': never[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Important Geophysical Phenomena'?: undefined;
    } | {
        'Important Geophysical Phenomena': {
            Earthquakes: string[];
            Tsunami: string[];
            Volcanoes: string[];
            Cyclone: string[];
            'Factors Causing Changes in Critical Geographical Features': never[];
            'Examples of Changing Geographical Features': string[];
            'Impact of Changing Geographical Features': never[];
            'Physical Geography of India': string[];
            'Human Geography': string[];
            'Economic Geography': string[];
        };
        'Art and culture'?: undefined;
        'Ancient History'?: undefined;
        'Medieval History'?: undefined;
        'Modern History'?: undefined;
        'Post-independence India'?: undefined;
        'World History'?: undefined;
        'Indian Society'?: undefined;
        'World and Indian Geography'?: undefined;
        'Distribution of Key Natural Resources across the world'?: undefined;
        'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world'?: undefined;
    })[];
};

declare const gs2Categories: {
    categories: ({
        Polity: {
            'Indian Constitution': {
                'Historical Underpinning & Evolution': string[];
                Features: string[];
                Amendments: string[];
                'Basic Features': string[];
                'Significant Provisions': string[];
            };
            'Functions & Responsibilities of the Union and the States': {
                '7th Schedule': never[];
                'Legislative Functions': never[];
                'Financial Functions': never[];
                'Administrative & Quasi-Judicial Functions': never[];
            };
            'Issues & Challenges Pertaining to the Federal Structure': {
                'Federal Structure in India - Is India truly Federal?': never[];
                'Cooperative & Competitive Federalism': never[];
                'Centre-State Relations': {
                    'Legislative Relations': never[];
                    'Administrative Relations': never[];
                    'Financial Relations': never[];
                    'Trends in Centre-State Relations': never[];
                };
                'Inter-State Relations': {
                    'Inter-state Water Disputes': never[];
                    'Inter-State Councils': never[];
                    'Public Acts, Records and Judicial Proceedings': never[];
                    'Inter-State Trade and Commerce': never[];
                    'Zonal Councils': never[];
                };
                'Emergency Provisions': never[];
                'Role of Governor': never[];
                'Reports of Various Commissions': string[];
            };
            'Devolution of Powers & Finances to Local Levels & Challenges Therein': {
                'Role of State Government': never[];
                'Role of State Finance Commission': never[];
                '11th & 12th Schedule': never[];
                'Reasons for Ineffective Performance': never[];
                'Panchayat Devolution Index (NITI Aayog)': never[];
                'Steps That Can Be Taken to Improve Their Performance': never[];
            };
            'Separation of Powers Between Various Organs': {
                'Doctrine of Separation of Power': never[];
                'Separation of Power in Indian Constitution': never[];
                'Doctrine of Checks & Balances': never[];
                'Provisions for Checks & Balances in Indian Constitution': never[];
                'Related Judgments - Golaknath case, Kesavananda Bharati, Indira Gandhi Vs Raj Narain, Ram Jawaya vs Punjab': never[];
            };
            'Dispute Redressal Mechanisms and Institutions': {
                RTI: never[];
                PIL: never[];
                'Tribunals, etc.': never[];
            };
            'Comparison of the Indian Constitutional Scheme With That of Other Countries Parliament & State Legislatures': {
                'Structure, Functioning, Conduct of Business, Powers & Privileges': {
                    'Written Constitution': never[];
                    'Blend of Rigidity and Flexibility': never[];
                    'Federal System with Unitary Bias': never[];
                    'Parliamentary Form of Government': never[];
                    'Synthesis of Parliamentary Sovereignty and Judicial Supremacy': never[];
                    'Integrated and Independent Judiciary': never[];
                    'Fundamental Rights, Directive Principles of State Policy, Fundamental Duties': never[];
                    'Secular State': never[];
                    'Universal Adult Franchise': never[];
                    'Single Citizenship': never[];
                    'Emergency Provisions': never[];
                    'Three-tier Government': never[];
                    'Due Process of Law vs. Procedure Established by Law': never[];
                    'Impeachment of President, etc.': never[];
                };
            };
            'Structure, Organization & Functioning of the Executive and the Judiciary': {
                Executive: {
                    Union: string[];
                    State: string[];
                };
                Judiciary: string[];
            };
            'Ministries and Departments of the Government': {
                'Cabinet Ministries': never[];
                'Other Ministries': never[];
                'Parliamentary Secretaries': never[];
            };
            'Pressure Groups & Formal/informal Associations & Their Role in Polity': {
                'Characteristics of Pressure Groups': never[];
                'Pressure Groups & Political Parties': never[];
                'Pressure Groups & Interest Groups': never[];
                'Types of Pressure Groups': never[];
                'Functions, Role & Importance of Pressure Groups': never[];
                'Techniques/Methods of Pressure Groups': never[];
                'Pressure Groups in India': never[];
                'Shortcomings of Pressure Groups': never[];
            };
            "Salient Features of Representation of People's Act": never[];
            'Appointment to Various Constitutional Posts': {
                'Appointment, Powers, Functions & Responsibilities of': string[];
            };
            'Statutory, Regulatory & Quasi-Judicial Bodies': {
                'NITI Aayog': never[];
                RBI: never[];
                'National Human Rights Commission': never[];
                'State Human Rights Commission': never[];
                'Central Information Commission': never[];
                'Central Vigilance Commission': never[];
                'Central Bureau of Investigation': never[];
                'Lokpal and Lokayuktas': never[];
                'National Commission for Women': never[];
                'National Commission for Backward Classes': never[];
                'National Commission for Minorities': never[];
                'Insurance Regulatory and Development Authority': never[];
                'Securities and Exchange Board of India': never[];
                'Competition Commission of India': never[];
                'Telecom Regulatory Authority of India': never[];
                'Central Electricity Regulatory Commission': never[];
                'Atomic Energy Regulatory Board': never[];
                'Central Pollution Control Board': never[];
                'Medical Council of India': never[];
                'Inland Waterways Authority of India': never[];
                'Central Ground Water Authority': never[];
                'Directorate General of Civil Aviation': never[];
                'Pension Fund Regulatory and Development Authority': never[];
                'Food Safety and Standards Authority of India': never[];
                'Bar Council of India': never[];
                'University Grants Commission': never[];
                'Financial Stability and Development Council': never[];
                'All India Council for Technical Education': never[];
                'National Green Tribunal': never[];
                'Competition Appellate Tribunal': never[];
                'Income-Tax Appellate Tribunal': never[];
                'Cyber Appellate Tribunal': never[];
                'Intellectual Property Appellate Board': never[];
            };
        };
        Governance?: undefined;
        'Social Justice'?: undefined;
        'International Relations'?: undefined;
    } | {
        Governance: {
            'Government Policies and Interventions for Development': {
                'Government Policies and Interventions in Various Sectors': string[];
                'Issues Arising Out of Their Design and Implementation': {
                    'Concerns/Issues': never[];
                    'Suggestions for Improvement': never[];
                    'Critical Assessment of Centrally Sponsored Schemes (CSS)': never[];
                    'Rationalisation of CSS': never[];
                    'Analysis of Main Schemes': {
                        'Beti Bachao Beti Padhao': never[];
                        'Smart City': never[];
                        'Swachh Bharat Abhiyan': never[];
                        MGNERGA: never[];
                        'Digital India': never[];
                        'Make in India': never[];
                        'Skill India': never[];
                        'PM Jan Dhan Yojana': never[];
                        'Start-up India etc.': never[];
                    };
                };
            };
            'Development Processes and the Development Industry': {
                'Role of Social Capital Organisations': never[];
                'Indian Context': never[];
                Classification: never[];
                'Provisions for the Third Sector in the Indian Constitution': never[];
                'National Policy on the Voluntary Sector 2007': never[];
                'Non-Governmental Organisations': {
                    'Role and Impact of Non-governmental Organizations': never[];
                    'Issue Areas': string[];
                };
                'Self Help Groups (SHGs)': {
                    'Need for SHGs': never[];
                    'Benefits of SHGs': never[];
                    'Weaknesses of SHGs': never[];
                    Challenges: never[];
                    'Measures to Make SHGs Effective': never[];
                    'Case Studies': string[];
                };
                'Societies Trusts and Cooperatives': {
                    Societies: never[];
                    Trust: never[];
                    'Religious Endowments': never[];
                    Cooperatives: {
                        'Need for Cooperatives': never[];
                        'Constitutional Provisions': never[];
                        'National Policy on Co-operatives 2002': never[];
                        'Issues and Challenges in the Cooperatives Sector': never[];
                    };
                };
            };
            'Important Aspects of Governance Transparency & Accountability': {
                Governance: {
                    'Dimensions of Governance': never[];
                    'Good Governance (GG)': never[];
                    'Aspects of GG': never[];
                    'Barriers to GG': never[];
                    'Necessary Pre-conditions for GG': never[];
                    'How to Ensure GG': never[];
                };
                'E-Governance': {
                    Applications: never[];
                    Models: never[];
                    Successes: never[];
                    Limitations: never[];
                    Potential: never[];
                    'Recent e-governance Initiatives by Government': never[];
                };
                'Citizens Charters (CC)': {
                    'Components of CC': never[];
                    'Features of CC': never[];
                    'Six Principles of CC': never[];
                    'Shortcomings of CC': never[];
                    'Measures to Make CC Effective': never[];
                    'Sevottam Model': never[];
                };
                'Aspects of Transparency': never[];
                'Elements & Types of Accountability': never[];
                'Means to ensure Transparency & Accountability': string[];
            };
            'Role of Civil Services in a Democracy': {
                'Relationship Between Civil Service And Democracy': never[];
                'Role Played By Civil Services': string[];
                'Ailments/Issues Afflicting Indian Civil Services': string[];
                'Reforming Bureaucracy to Strengthen Democracy': string[];
            };
        };
        Polity?: undefined;
        'Social Justice'?: undefined;
        'International Relations'?: undefined;
    } | {
        'Social Justice': {
            'Welfare Schemes for Vulnerable Sections': {
                'SCs & STs': {};
                Minorities: {};
                Children: {};
                Elderly: {};
                Disabled: {};
                Women: {};
                Transgender: {};
            };
            'Performance of These Schemes': {};
            'Mechanisms, Laws, Institutions & Bodies Constituted for Protection & Betterment of Vulnerable Sections': {
                SCs: {
                    'The Protection of Civil Rights Act': {};
                    'The Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act': {};
                    'National Commission for Scheduled Castes': {};
                    'Scheduled Castes Sub Plan': {};
                };
                Disabled: {
                    'The Rehabilitation Council of India Act': {};
                    'The Persons with Disabilities (Equal Opportunities, Protection of Rights and Full Participation) Act': {};
                    'Mental Retardation and Multiple Disabilities Act': {};
                    'The National Trust for Welfare of Persons with Autism, Cerebral Palsy, Mental Retardation and Multiple Disabilities Act': {};
                    'Rights of the Persons with Disabilities Act': {};
                };
                STs: {
                    'National Commission for Scheduled Tribes': {};
                    'Tribal Sub Plan': {};
                    TRIFED: {};
                    'Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act': {};
                };
                Minorities: {
                    'National Commission for Minorities': {};
                    'National Commission for Religious and Linguistic Minorities': {};
                };
            };
            'Women & Children': {
                'The Immoral Traffic (Prevention) Act': {};
                'The Indecent Representation of Women (Prevention) Act': {};
                'The Dowry Prohibition Act': {};
                'The Commission of Sati (Prevention) Act': {};
                'The Prohibition of Child Marriage Act': {};
                'Protection of Women from Domestic Violence Act': {};
                'Juvenile Justice (Care and Protection of Children) Act': {};
                'Central Adoption Resource Agency (CARA)': {};
                'The Protection of Children from Sexual Offences (POCSO) Act': {};
                'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal)': {};
                'Pre-Conception and Pre Natal Diagnostic Techniques (PC&PNDT) Act': {};
                'Gender Budgeting': {};
                'National Policy for Women': {};
                'Domestic Violence Act': {};
                'Maternity Benefit (Amendment) Act': {};
            };
            Elderly: {
                'Maintenance and Welfare of Parents and Senior Citizens Act': {};
            };
            'Issues Relating to Development & Management of Social Sector/Services': {
                Health: {
                    'India\u2019s Performance on Various Health Indicators': {};
                    'Weaknesses of Indian Healthcare System': {};
                    'Health Infrastructure in India': {};
                    'Universal Health Coverage': {};
                    '12th FYP Strategy': {};
                    'Health Insurance': {};
                    'National Family Health Survey': {};
                    'National Health Policy': {};
                    'National Health Mission': {};
                    'Maternal & Adolescent Health': {};
                    'Child Health': {};
                    'Antimicrobial Resistance': {};
                    'Disease Burden in India': {};
                    'Measures to Ensure Good Health Outcomes': {};
                    'Government Initiatives': {};
                };
                Education: {
                    'Status of Literacy in India': {};
                    'Education Structure in India': {};
                    'Challenges Faced by Education Sector in India': {};
                    'Reforms Required': {};
                    'Government Initiatives': {};
                    'ASER Report': {};
                    'Financing Education': {};
                    'Subramanian Panel Report': {};
                };
                'Human Resource': {
                    'Need For Skill Development': {};
                    'Skill Development Initiatives': {};
                    'Challenges in Skilling Landscape in India': {};
                    'Shortcomings of Current Skill Development Initiatives': {};
                    'Reforms Required': {};
                    'Steps that can Be Taken': {};
                };
            };
            'Issues Relating to Poverty & Hunger': {
                'Relation between Poverty & Hunger': {};
                'Distribution of Poverty & Hunger': {};
                'Magnitude & Trends of Poverty & Hunger': {};
                'Causes of Poverty & Hunger': {};
                'Cost/Impact of Poverty & Malnutrition': {};
                'MDGs & SDGs': {};
                'Food and nutrition insecurity - a consequence of structural inequities': {};
                'Constraints in Reducing Poverty & Hunger': {};
                'Measure to Reduce Poverty & Hunger \u2013 National Food Security Act, Mid-day Meal Scheme, MGNREGA etc.': {};
            };
        };
        Polity?: undefined;
        Governance?: undefined;
        'International Relations'?: undefined;
    } | {
        'International Relations': {
            'India and its Neighborhood \u2013 Relations': {
                'India\u2019s Relations With': string[];
            };
            "Bilateral, Regional & Global Groupings & Agreements Involving India and/or Affecting India's Interests": {
                'India\u2019s Major Foreign Policy Doctrines Since 1947': string[];
                'Bilateral Relations With': string[];
                'Regional & Global Groupings': string[];
            };
            "Effect of Policies & Politics of Developed & Developing Countries on India's Interests": string[];
            'Indian Diaspora': {
                'Spread of Indian Diaspora': never[];
                'India\u2019s Diaspora Policy & Engagement Initiatives': string[];
                'LM Singhvi High Level Committee on the Diaspora': never[];
                'Role played by Indian Diaspora': never[];
                'Issues Concerning the Diaspora': string[];
            };
            'Important International Institutions': string[];
        };
        Polity?: undefined;
        Governance?: undefined;
        'Social Justice'?: undefined;
    })[];
};

declare const gs3Categories: {
    categories: ({
        'ECONOMIC DEVELOPMENT': {
            'Indian Economy & Issues Relating to Planning, Mobilization of Resources, Growth, Development & Employment': {
                Planning: string[];
                'Mobilisation of Resources': string[];
                'Growth & Development': {
                    'Meaning of Development & Growth': never[];
                    'Difference between Development & Growth': never[];
                    'Determinants of Growth & Development': never[];
                    'Importance & Limitations of Economic Growth': never[];
                    'Jobless Growth': never[];
                    'Pro-Poor Growth': never[];
                    'Balanced & Unbalanced Growth': never[];
                    'Dimensions of Development': never[];
                    'Measurement & Indicators of Development': never[];
                    'Approaches to Development': string[];
                    'Challenges to Development & Growth': never[];
                };
                Employment: string[];
            };
            'Inclusive Growth & Issues Arising From It': string[];
            'Government Budgeting': ({
                'Need for Government Budgeting': never[];
                'Components of the Government Budget'?: undefined;
                'Changes in Budgetary Process in 2017'?: undefined;
                'Measures of Government Deficit'?: undefined;
                'Fiscal Policy'?: undefined;
                'Deficit Reduction'?: undefined;
                'FRBM Act'?: undefined;
                'Other Types of Budgets \u2013 Outcome, Zero-Based, etc.'?: undefined;
            } | {
                'Components of the Government Budget': string[];
                'Need for Government Budgeting'?: undefined;
                'Changes in Budgetary Process in 2017'?: undefined;
                'Measures of Government Deficit'?: undefined;
                'Fiscal Policy'?: undefined;
                'Deficit Reduction'?: undefined;
                'FRBM Act'?: undefined;
                'Other Types of Budgets \u2013 Outcome, Zero-Based, etc.'?: undefined;
            } | {
                'Changes in Budgetary Process in 2017': never[];
                'Need for Government Budgeting'?: undefined;
                'Components of the Government Budget'?: undefined;
                'Measures of Government Deficit'?: undefined;
                'Fiscal Policy'?: undefined;
                'Deficit Reduction'?: undefined;
                'FRBM Act'?: undefined;
                'Other Types of Budgets \u2013 Outcome, Zero-Based, etc.'?: undefined;
            } | {
                'Measures of Government Deficit': string[];
                'Need for Government Budgeting'?: undefined;
                'Components of the Government Budget'?: undefined;
                'Changes in Budgetary Process in 2017'?: undefined;
                'Fiscal Policy'?: undefined;
                'Deficit Reduction'?: undefined;
                'FRBM Act'?: undefined;
                'Other Types of Budgets \u2013 Outcome, Zero-Based, etc.'?: undefined;
            } | {
                'Fiscal Policy': never[];
                'Need for Government Budgeting'?: undefined;
                'Components of the Government Budget'?: undefined;
                'Changes in Budgetary Process in 2017'?: undefined;
                'Measures of Government Deficit'?: undefined;
                'Deficit Reduction'?: undefined;
                'FRBM Act'?: undefined;
                'Other Types of Budgets \u2013 Outcome, Zero-Based, etc.'?: undefined;
            } | {
                'Deficit Reduction': never[];
                'Need for Government Budgeting'?: undefined;
                'Components of the Government Budget'?: undefined;
                'Changes in Budgetary Process in 2017'?: undefined;
                'Measures of Government Deficit'?: undefined;
                'Fiscal Policy'?: undefined;
                'FRBM Act'?: undefined;
                'Other Types of Budgets \u2013 Outcome, Zero-Based, etc.'?: undefined;
            } | {
                'FRBM Act': never[];
                'Need for Government Budgeting'?: undefined;
                'Components of the Government Budget'?: undefined;
                'Changes in Budgetary Process in 2017'?: undefined;
                'Measures of Government Deficit'?: undefined;
                'Fiscal Policy'?: undefined;
                'Deficit Reduction'?: undefined;
                'Other Types of Budgets \u2013 Outcome, Zero-Based, etc.'?: undefined;
            } | {
                'Other Types of Budgets \u2013 Outcome, Zero-Based, etc.': never[];
                'Need for Government Budgeting'?: undefined;
                'Components of the Government Budget'?: undefined;
                'Changes in Budgetary Process in 2017'?: undefined;
                'Measures of Government Deficit'?: undefined;
                'Fiscal Policy'?: undefined;
                'Deficit Reduction'?: undefined;
                'FRBM Act'?: undefined;
            })[];
            'Land Reforms in India': ({
                'Rationale for Land Reforms': never[];
                'Components of Land Reforms'?: undefined;
                'Impact of Land Reforms'?: undefined;
                'Problems in Implementation of Land Reforms'?: undefined;
                'Success of Land Reforms'?: undefined;
                'Recent Initiatives - Land Leasing, Land Acquisition, Rehabilitation & Resettlement Act, etc.'?: undefined;
            } | {
                'Components of Land Reforms': never[];
                'Rationale for Land Reforms'?: undefined;
                'Impact of Land Reforms'?: undefined;
                'Problems in Implementation of Land Reforms'?: undefined;
                'Success of Land Reforms'?: undefined;
                'Recent Initiatives - Land Leasing, Land Acquisition, Rehabilitation & Resettlement Act, etc.'?: undefined;
            } | {
                'Impact of Land Reforms': never[];
                'Rationale for Land Reforms'?: undefined;
                'Components of Land Reforms'?: undefined;
                'Problems in Implementation of Land Reforms'?: undefined;
                'Success of Land Reforms'?: undefined;
                'Recent Initiatives - Land Leasing, Land Acquisition, Rehabilitation & Resettlement Act, etc.'?: undefined;
            } | {
                'Problems in Implementation of Land Reforms': never[];
                'Rationale for Land Reforms'?: undefined;
                'Components of Land Reforms'?: undefined;
                'Impact of Land Reforms'?: undefined;
                'Success of Land Reforms'?: undefined;
                'Recent Initiatives - Land Leasing, Land Acquisition, Rehabilitation & Resettlement Act, etc.'?: undefined;
            } | {
                'Success of Land Reforms': never[];
                'Rationale for Land Reforms'?: undefined;
                'Components of Land Reforms'?: undefined;
                'Impact of Land Reforms'?: undefined;
                'Problems in Implementation of Land Reforms'?: undefined;
                'Recent Initiatives - Land Leasing, Land Acquisition, Rehabilitation & Resettlement Act, etc.'?: undefined;
            } | {
                'Recent Initiatives - Land Leasing, Land Acquisition, Rehabilitation & Resettlement Act, etc.': never[];
                'Rationale for Land Reforms'?: undefined;
                'Components of Land Reforms'?: undefined;
                'Impact of Land Reforms'?: undefined;
                'Problems in Implementation of Land Reforms'?: undefined;
                'Success of Land Reforms'?: undefined;
            })[];
            'Effects of Liberalization on the Economy': ({
                'Phase of Liberalisation': never[];
                'Impact on Different Sectors of the Economy'?: undefined;
            } | {
                'Impact on Different Sectors of the Economy': never[];
                'Phase of Liberalisation'?: undefined;
            })[];
            'Changes In Industrial Policy & their Effects on Industrial Growth': ({
                'Industrial Policy Before 1991': never[];
                'Industrial Policy After 1991'?: undefined;
                'Phases of Industrial Growth'?: undefined;
                'Linkage Between Economic Reforms and Economic Outcomes'?: undefined;
                'Weaknesses and Failures of Industrial Policies'?: undefined;
                'National Manufacturing Policy'?: undefined;
                SEZs?: undefined;
                'Make in India'?: undefined;
            } | {
                'Industrial Policy After 1991': never[];
                'Industrial Policy Before 1991'?: undefined;
                'Phases of Industrial Growth'?: undefined;
                'Linkage Between Economic Reforms and Economic Outcomes'?: undefined;
                'Weaknesses and Failures of Industrial Policies'?: undefined;
                'National Manufacturing Policy'?: undefined;
                SEZs?: undefined;
                'Make in India'?: undefined;
            } | {
                'Phases of Industrial Growth': never[];
                'Industrial Policy Before 1991'?: undefined;
                'Industrial Policy After 1991'?: undefined;
                'Linkage Between Economic Reforms and Economic Outcomes'?: undefined;
                'Weaknesses and Failures of Industrial Policies'?: undefined;
                'National Manufacturing Policy'?: undefined;
                SEZs?: undefined;
                'Make in India'?: undefined;
            } | {
                'Linkage Between Economic Reforms and Economic Outcomes': never[];
                'Industrial Policy Before 1991'?: undefined;
                'Industrial Policy After 1991'?: undefined;
                'Phases of Industrial Growth'?: undefined;
                'Weaknesses and Failures of Industrial Policies'?: undefined;
                'National Manufacturing Policy'?: undefined;
                SEZs?: undefined;
                'Make in India'?: undefined;
            } | {
                'Weaknesses and Failures of Industrial Policies': never[];
                'Industrial Policy Before 1991'?: undefined;
                'Industrial Policy After 1991'?: undefined;
                'Phases of Industrial Growth'?: undefined;
                'Linkage Between Economic Reforms and Economic Outcomes'?: undefined;
                'National Manufacturing Policy'?: undefined;
                SEZs?: undefined;
                'Make in India'?: undefined;
            } | {
                'National Manufacturing Policy': never[];
                'Industrial Policy Before 1991'?: undefined;
                'Industrial Policy After 1991'?: undefined;
                'Phases of Industrial Growth'?: undefined;
                'Linkage Between Economic Reforms and Economic Outcomes'?: undefined;
                'Weaknesses and Failures of Industrial Policies'?: undefined;
                SEZs?: undefined;
                'Make in India'?: undefined;
            } | {
                SEZs: never[];
                'Industrial Policy Before 1991'?: undefined;
                'Industrial Policy After 1991'?: undefined;
                'Phases of Industrial Growth'?: undefined;
                'Linkage Between Economic Reforms and Economic Outcomes'?: undefined;
                'Weaknesses and Failures of Industrial Policies'?: undefined;
                'National Manufacturing Policy'?: undefined;
                'Make in India'?: undefined;
            } | {
                'Make in India': never[];
                'Industrial Policy Before 1991'?: undefined;
                'Industrial Policy After 1991'?: undefined;
                'Phases of Industrial Growth'?: undefined;
                'Linkage Between Economic Reforms and Economic Outcomes'?: undefined;
                'Weaknesses and Failures of Industrial Policies'?: undefined;
                'National Manufacturing Policy'?: undefined;
                SEZs?: undefined;
            })[];
            Infrastructure: ({
                Energy: never[];
                Ports?: undefined;
                Roads?: undefined;
                Airports?: undefined;
                Railways?: undefined;
            } | {
                Ports: never[];
                Energy?: undefined;
                Roads?: undefined;
                Airports?: undefined;
                Railways?: undefined;
            } | {
                Roads: never[];
                Energy?: undefined;
                Ports?: undefined;
                Airports?: undefined;
                Railways?: undefined;
            } | {
                Airports: never[];
                Energy?: undefined;
                Ports?: undefined;
                Roads?: undefined;
                Railways?: undefined;
            } | {
                Railways: never[];
                Energy?: undefined;
                Ports?: undefined;
                Roads?: undefined;
                Airports?: undefined;
            })[];
            'Investment Models': ({
                'Need for Investment': never[];
                'Sources of Investment'?: undefined;
                'Types of Investment Models'?: undefined;
                'Investment Models Followed by India'?: undefined;
            } | {
                'Sources of Investment': never[];
                'Need for Investment'?: undefined;
                'Types of Investment Models'?: undefined;
                'Investment Models Followed by India'?: undefined;
            } | {
                'Types of Investment Models': (string | {
                    'Domestic Investment Models': string[];
                    'Foreign Investment Models'?: undefined;
                } | {
                    'Foreign Investment Models': string[];
                    'Domestic Investment Models'?: undefined;
                })[];
                'Need for Investment'?: undefined;
                'Sources of Investment'?: undefined;
                'Investment Models Followed by India'?: undefined;
            } | {
                'Investment Models Followed by India': never[];
                'Need for Investment'?: undefined;
                'Sources of Investment'?: undefined;
                'Types of Investment Models'?: undefined;
            })[];
        };
        AGRICULTURE?: undefined;
        'SCIENCE & TECHNOLOGY'?: undefined;
        'BIODIVERSITY & ENVIRONMENT'?: undefined;
        SECURITY?: undefined;
    } | {
        AGRICULTURE: {
            'Major Crops Cropping Patterns in Various Parts of the Country': string[];
            'Different Types of Irrigation & Irrigation Systems Storage': string[];
            'Transport & Marketing of Agricultural Produce & Issues & Related Constraints': string[];
            'E-Technology in the Aid of Farmers, Technology Missions': never[];
            'Issues Related to Direct & Indirect Farm Subsidies & Minimum Support Prices': string[];
            'Public Distribution System Objectives, Functioning, Limitations, Revamping': string[];
            'Issues of Buffer Stocks & Food Security': string[];
            'Economics of Animal-Rearing': never[];
            'Food Processing & Related Industries in India': string[];
        };
        'ECONOMIC DEVELOPMENT'?: undefined;
        'SCIENCE & TECHNOLOGY'?: undefined;
        'BIODIVERSITY & ENVIRONMENT'?: undefined;
        SECURITY?: undefined;
    } | {
        'SCIENCE & TECHNOLOGY': {
            'Developments & their Applications & Effects in Everyday Life': {
                'Chemicals in Food': string[];
                Drugs: (string | {
                    'Neurologically Active Drugs': string[];
                    Antimicrobials?: undefined;
                } | {
                    Antimicrobials: string[];
                    'Neurologically Active Drugs'?: undefined;
                })[];
                'Cleansing Agents': string[];
                Glass: never[];
                'Water Softener': never[];
                'Water Purification/Disinfection': never[];
                'Microwave Oven, etc.': never[];
            };
            'Achievements of Indians in Science & Technology': {
                'Indian Scientists': string[];
            };
            'Indigenization of Technology & Developing New Technology': string[];
            'Awareness in Different Fields': {
                'IT & Computers': never[];
                Space: never[];
                Nanotechnology: never[];
                Biotechnology: never[];
                Robotics: never[];
                Defence: never[];
                Nuclear: never[];
            };
            'Issues Relating to Intellectual Property Rights': string[];
        };
        'ECONOMIC DEVELOPMENT'?: undefined;
        AGRICULTURE?: undefined;
        'BIODIVERSITY & ENVIRONMENT'?: undefined;
        SECURITY?: undefined;
    } | {
        'BIODIVERSITY & ENVIRONMENT': {
            Conservation: {
                'What is Biodiversity?': never[];
                'Types of Biodiversity \u2013 Genetic, Species, Ecosystem, etc.': never[];
                'Importance of Biodiversity \u2013 Ecosystem Services, Bio Resources of Economic Importance, Social Benefits etc.': never[];
                'Reasons for Loss of Biodiversity': never[];
                'In-situ & Ex-Situ': never[];
                'Eco-Sensitive Areas': never[];
                'Ecological Hotspots': never[];
                'National Guidelines, Legislations & Other Programmes.': never[];
                'International Agreements & Groupings': never[];
            };
            'Environmental Pollution & Degradation': {
                'Types of Pollution & Pollutants': never[];
                'Impact of Pollution & Degradation': string[];
                'Causes/Sources of Pollution & Degradation': never[];
                'Prevention & Control of Pollution & Degradation': never[];
                'National Environment Agencies, Legislations and Policies': never[];
                'International Environment Agencies & Agreements': never[];
            };
            'Environmental Impact Assessment (EIA)': {
                'What is EIA?': never[];
                'Indian Guidelines & Legislations': never[];
                'EIA Process': never[];
                'Need & Benefits of EIA': never[];
                'Shortcomings of EIA in India': never[];
                'Measures to Make EIA Effective': never[];
            };
            'Disaster Management': {
                'Types of Disasters': never[];
                'Management of Disasters': never[];
                'Community Level Disaster Management': never[];
                'Governement Initiatives on Disaster Management': never[];
            };
        };
        'ECONOMIC DEVELOPMENT'?: undefined;
        AGRICULTURE?: undefined;
        'SCIENCE & TECHNOLOGY'?: undefined;
        SECURITY?: undefined;
    } | {
        SECURITY: {
            'Linkages Between Development & Spread of Extremism': {
                'Factors Responsible for Spread of Extremism': never[];
                'Steps that State can Taken to Reduce the Spread of Extremism due to Underdevelopment': never[];
                Naxalism: never[];
            };
            'Role of External State & Non-State Actors in Creating Challenges to Internal Security': {
                'Threats from Non-State Actors': string[];
                'Reasons for Spread of Terrorism': never[];
                'State Sponsored Terrorism': never[];
            };
            'Institutional Framework to Tackle Challenge of Internal Security': {
                NIA: never[];
                NATGRID: never[];
                MAC: never[];
                UAPA: never[];
                TADA: never[];
                POTA: never[];
                NCTC: never[];
            };
            'Challenges to Internal Security Through Communication Networks': {
                'Role of Media & Social Networking Sites in Internal Security Challenges': never[];
                'Challenges in Managing Social Media': never[];
                'Steps That can be Taken-  Internal Security': never[];
            };
            'Basics of Cyber Security': {
                'Cyber Security': never[];
                'Threats to Indian Cyber Security': never[];
                'Steps taken by India- cyber security': never[];
                'International Cooperation on Cyber Security': never[];
                'Cyber Warfare': never[];
                'Terms Associated with Cyber Security': never[];
            };
            'Money-Laundering & its Prevention': {
                'Process of Money Laundering': never[];
                'Impact of Money Laundering': never[];
                'Challenges to Tackle Money Laundering': never[];
                'Steps to Counter Money Laundering': never[];
                'Terms Related To Money Laundering': never[];
            };
            'Security Challenges & their Management in Border Areas': {
                'Challenges in Managing Border Security \u2013 Coastal & Terrestrial': never[];
                'Land Boundary Disputes with Neighbours': never[];
                "India's Policy in Border Area Security Management": never[];
            };
            'Linkages of Organized Crime with Terrorism': {
                'Types of Organised Crime': never[];
                'Challenges in Controlling Organised Crime': never[];
                'Indian Context \u2013 Link between Organised Crime & Terrorism': never[];
            };
            'Various Security Forces & Agencies & Their Mandate': {
                'Central Armed Police Forces': never[];
                'Central Paramilitary Forces': never[];
                'Security & Intelligence Agencies \u2013 IB, R&AW, etc.': never[];
            };
        };
        'ECONOMIC DEVELOPMENT'?: undefined;
        AGRICULTURE?: undefined;
        'SCIENCE & TECHNOLOGY'?: undefined;
        'BIODIVERSITY & ENVIRONMENT'?: undefined;
    })[];
};

declare const gs4Categories: {
    categories: ({
        'Ethics and Human Interface': {
            'Essence, Determinants, Consequences of Ethics in Human Actions': never[];
            'Dimensions of Ethics': never[];
            'Ethics in Private and Public Relationships': never[];
            'Human Values - Lessons from the Lives and Teachings of Great Leaders, Reformers, and Administrators': never[];
            'Role of Family, Society, and Educational Institutions in Inculcating Values': never[];
        };
        Attitude?: undefined;
        'Aptitude and Foundational Values for Civil Service Integrity'?: undefined;
        'Emotional Intelligence-Concepts, and their Utilities and Application in Administration and Governance'?: undefined;
        'Contributions of Moral Thinkers and Philosophers from India and World'?: undefined;
        'Public/Civil Service Values and Ethics in Public Administration'?: undefined;
        'Probity in Governance'?: undefined;
    } | {
        Attitude: {
            'Attitude- Content, Structure, Function': never[];
            'Attitude Influence and Relation with Thought and Behaviour': never[];
            'Moral and Political Attitudes': never[];
            'Social Influence and Persuasion': never[];
        };
        'Ethics and Human Interface'?: undefined;
        'Aptitude and Foundational Values for Civil Service Integrity'?: undefined;
        'Emotional Intelligence-Concepts, and their Utilities and Application in Administration and Governance'?: undefined;
        'Contributions of Moral Thinkers and Philosophers from India and World'?: undefined;
        'Public/Civil Service Values and Ethics in Public Administration'?: undefined;
        'Probity in Governance'?: undefined;
    } | {
        'Aptitude and Foundational Values for Civil Service Integrity': {
            'Impartiality and Non-partisanship, Objectivity': never[];
            'Dedication to Public Service': never[];
            'Empathy, Tolerance, and Compassion towards the weaker sections': never[];
        };
        'Ethics and Human Interface'?: undefined;
        Attitude?: undefined;
        'Emotional Intelligence-Concepts, and their Utilities and Application in Administration and Governance'?: undefined;
        'Contributions of Moral Thinkers and Philosophers from India and World'?: undefined;
        'Public/Civil Service Values and Ethics in Public Administration'?: undefined;
        'Probity in Governance'?: undefined;
    } | {
        'Emotional Intelligence-Concepts, and their Utilities and Application in Administration and Governance': {};
        'Contributions of Moral Thinkers and Philosophers from India and World': {};
        'Public/Civil Service Values and Ethics in Public Administration': {
            'Status and Problems': never[];
            'Ethical Concerns and Dilemmas in Government and Private Institutions': never[];
            'Laws, Rules, Regulations, and Conscience as Sources of Ethical Guidance': never[];
            'Accountability and Ethical Governance': never[];
            'Strengthening of Ethical and Moral Values in Governance': never[];
            'Ethical Issues in International Relations and Funding': never[];
            'Corporate Governance': never[];
        };
        'Ethics and Human Interface'?: undefined;
        Attitude?: undefined;
        'Aptitude and Foundational Values for Civil Service Integrity'?: undefined;
        'Probity in Governance'?: undefined;
    } | {
        'Probity in Governance': {
            'Concept of Public Service': never[];
            'Philosophical Basis of Governance and Probity': never[];
            'Information Sharing and Transparency in Government': never[];
            'Right to Information': never[];
            'Codes of Ethics, Codes of Conduct': never[];
            'Citizen\u2019s Charters': never[];
            'Work Culture, Quality of Service Delivery': never[];
            'Utilization of Public Funds': never[];
            'Challenges of Corruption': never[];
        };
        'Ethics and Human Interface'?: undefined;
        Attitude?: undefined;
        'Aptitude and Foundational Values for Civil Service Integrity'?: undefined;
        'Emotional Intelligence-Concepts, and their Utilities and Application in Administration and Governance'?: undefined;
        'Contributions of Moral Thinkers and Philosophers from India and World'?: undefined;
        'Public/Civil Service Values and Ethics in Public Administration'?: undefined;
    })[];
};

declare const optionalsCategories: {
    categories: ({
        Agriculture: {
            'Ecology and its relevance to man': string[];
            'Cropping patterns in different agro-climatic zones of the country': string[];
            'Important features and scope of various types of forestry plantations such as social forestry': string[];
            Weeds: string[];
            'Soils of India': string[];
            'Soil conservation': string[];
            'Farm management': string[];
            'Agricultural extension': string[];
            'Cell structure': string[];
            'History of plant breeding': string[];
            'Seed production and processing technologies': string[];
            'Principles of Plant Physiology': string[];
            'Enzymes and plant pigments': string[];
            'Major fruits': string[];
            'Diagnosis of pests and diseases of field crops': string[];
            'Food production and consumption trends in India': string[];
        };
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        'Civil Engineering': {
            'Engineering Mechanics, Strength of Materials and Structural Analysis:': string[];
            'Design of Structures: Steel, Concrete and Masonry Structures:': string[];
            'Fluid Mechanics, Open Channel Flow and Hydraulic Machines:': string[];
            'Geotechnical Engineering:': string[];
            'Construction Technology, Equipment, Planning and Management:': string[];
            'Surveying and Transportation Engineering:': string[];
            'Hydrology, Water Resources and Engineering:': string[];
            'Environmental Engineering:': string[];
            'Environmental pollution:': string[];
        };
        Agriculture?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Geology: {
            'General Geology': string[];
            'Geomorphology and Remote Sensing': string[];
            'Structural Geology': string[];
            Paleontology: string[];
            'Indian Stratigraphy': string[];
            'Hydrogeology and Engineering Geology': string[];
            Mineralogy: string[];
            'Igneous and Metamorphic Petrology': string[];
            'Sedimentary Petrology': string[];
            'Economic Geology': string[];
            'Mining Geology': string[];
            'Geochemistry and Environmental Geology': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        'Mechanical Engineering': {
            'Mechanics of Rigid Bodies': string[];
            'Mechanics of Deformable Bodies': string[];
            'Engineering Materials': string[];
            'Theory of Machines': string[];
            'Manufacturing Science': string[];
            'Manufacturing Management': string[];
            'Thermodynamics, Gas Dynamics, and Turbine': string[];
            'Heat Transfer': string[];
            'I .C. Engines': string[];
            'Steam Engineering': string[];
            'Refrigeration and Air-conditioning': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Commerce: {
            'Financial Accounting': string[];
            'Cost Accounting': string[];
            Taxation: string[];
            Auditing: string[];
            'Financial Management': string[];
            'Financial Markets and Institutions': string[];
            'Organization Theory': string[];
            'Organization Behavior': string[];
            'Human Resources Management (HRM)': string[];
            'Industrial Relations (IR)': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        History: {
            'Archaeological sources': string[];
            'Geographical factors': string[];
            Origin: string[];
            'Distribution of pastoral and farming cultures outside the Indus': string[];
            'Expansions of Aryans in India': string[];
            'Formation of States (Mahajanapada)': string[];
            'Foundation of the Mauryan Empire': string[];
            Sakas: string[];
            'Deccan and South India': string[];
            'Vakatakas and Vardhanas': string[];
            'The Kadambas': string[];
            'Languages and texts': string[];
            '750-1200': string[];
            '750- 1200': string[];
            '- Establishment of the Delhi Sultanate': string[];
            '- \u201CThe Khalji Revolution\u201D - Alauddin Khalji': string[];
            'Culture and Economy in the Thirteenth and Fourteenth Centuries': string[];
            '- Rise of Provincial Dynasties': string[];
            '- Regional cultural specificities - Literary traditions - Provincial architecture - Society': string[];
            '- Conquests and consolidation of the Empire - Establishment of Jagir and Mansab systems - Rajput policy - Evolution of religious and social outlook': string[];
            '- Major administrative policies of Jahangir': string[];
            '- Population': string[];
            '- Persian histories and other literature - Hindi and other religious literature - Mughal architecture - Mughal painting - Provincial architecture and painting - Classical music - Science and technology': never[];
            '- Factors for the decline of the Mughal Empire - The regional principalities': string[];
            'The Early European Settlements': string[];
            'Bengal \u2013 Mir Jafar and Mir Kasim': string[];
            'The early administrative structure': string[];
            '(a) Land revenue settlements in British India': string[];
            'The state of indigenous education': string[];
            'Ram Mohan Roy': string[];
            'Peasant movements and tribal uprisings in the 18th and 19th centuries including the Rangpur Dhing (1783)': string[];
            'Politics of Association': string[];
            'Character of Gandhian nationalism': string[];
            Bengal: string[];
            'the Muslim League': string[];
            'Nehru\u2019s Foreign Policy': string[];
            'Backward castes and tribes in post-colonial electoral politics': string[];
            'Land reforms': string[];
            '(i) Major ideas of Enlightenment': string[];
            '(i) European States System': string[];
            '(i) English Industrial Revolution': string[];
            '(i) Rise of Nationalism in 19th century (ii) Nationalism': string[];
            '(i) South and South-East Asia (ii) Latin America and South Africa (iii) Australia (iv) Imperialism and free trade': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        'Medical Science': {
            'Human Anatomy:': string[];
            'Human Physiology:': string[];
            'Biochemistry:': string[];
            'Pathology:': string[];
            'Microbiology:': string[];
            'Pharmacology:': string[];
            'Forensic Medicine and Toxicology: Forensic examination of injuries and wounds; Examination of blood and seminal stains; poisoning, sedative overdose, hanging, drowning, burns, DNA and fingerprint study': never[];
            'General Medicine:': string[];
            'Pediatrics:': string[];
            'Dermatology:': string[];
            'General Surgery:': string[];
            'Obstetrics and Gynaecology including Family Planning:': string[];
            'Community Medicine (Preventive and Social Medicine):': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        'Public Administration': {
            'Evolution of Indian Administration': never[];
            'Philosophical and Constitutional Framework of Government': never[];
            'Public Sector Undertaking': never[];
            'Union Government and Administration': never[];
            'Plan and Priorities': never[];
            'State Government and Administration': never[];
            'District Administration': never[];
            'Civil Services': never[];
            'Financial Management': never[];
            'Administrative Reforms since Independence': never[];
            'Rural Development': never[];
            'Urban Local Development': never[];
            'Law and Order Administration': never[];
            'Significant Issues in Indian Administration': never[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Anthropology: {
            'Meaning, scope and development of Anthropology': never[];
            'Relationships with other disciplines': string[];
            'Main branches of Anthropology, their scope and relevance': string[];
            'Biological and Cultural factors in human evolution': string[];
            'Characteristics of Primates': string[];
            'Phylogenetic status, characteristics and geographical distribution of the following': string[];
            'The biological basis of life': string[];
            'Principles of Prehistoric Archaeology': string[];
            'Cultural Evolution- Broad Outlines of Prehistoric cultures': string[];
            'The Nature of Culture': string[];
            'The Nature of Society': string[];
            Marriage: string[];
            Family: string[];
            Kinship: string[];
            'Economic organization': string[];
            'Political organization and Social Control': string[];
            Religion: string[];
            'Anthropological theories': string[];
            'Culture, language and communication': string[];
            'Research methods in anthropology': string[];
            'Human Genetics': string[];
            'Mendelian genetics in man-family study, single factor, multifactor, lethal, sub-lethal and polygenic inheritance in man': never[];
            'Concept of genetic polymorphism and selection, Mendelian population, HardyWeinberg law': string[];
            'Chromosomes and chromosomal aberrations in man, methodology': string[];
            'Race and racism, biological basis of morphological variation of non-metric and metric characters': string[];
            'Age, sex and population variation as genetic marker- ABO, Rh blood groups, HLA Hp, transferring, Gm, blood enzymes': string[];
            'Concepts and methods of Ecological Anthropology': string[];
            'Epidemiological Anthropology': string[];
            'Concept of human growth and development': string[];
            'Relevance of menarche, menopause and other bioevents to fertility': string[];
            'Demographic theories- biological, social and cultural': never[];
            'Biological and socio-ecological factors influencing fecundity, fertility, natality and mortality': never[];
            'Applications of Anthropology': string[];
            'Evolution of the Indian Culture and Civilization - Prehistoric (Palaeolithic, Mesolithic, Neolithic and Neolithic - Chalcolithic)': string[];
            'Palaeo - anthropological evidences from India with special reference to Siwaliks and Narmada basin (Ramapithecus, Sivapithecus and Narmada Man)': never[];
            'Ethno-archaeology in India': string[];
            'Demographic profile of India - Ethnic and linguistic elements in the Indian population and their distribution': string[];
            'The structure and nature of traditional Indian social system - Varnashram, Purushartha, Karma, Rina and Rebirth': never[];
            'Caste system in India- structure and characteristics, Varna and caste, Theories of origin of caste system, Dominant caste, Caste mobility, Future of caste system, Jajmani system, Tribecaste continuum': never[];
            'Sacred Complex and Nature- ManSpirit Complex': never[];
            'Impact of Buddhism, Jainism, Islam and Christianity on Indian society': never[];
            'Emergence and growth of anthropology in India-Contributions of the 18th, 19th and early 20th Century scholar-administrators': string[];
            'Indian Village': string[];
            'Linguistic and religious minorities and their social, political and economic status': never[];
            'Indigenous and exogenous processes of socio-cultural change in Indian society': string[];
            'Tribal situation in India - Bio-genetic variability, linguistic and socio-economic characteristics of tribal populations and their distribution': never[];
            'Problems of the tribal Communities - land alienation, poverty, indebtedness, low literacy, poor educational facilities, unemployment, underemployment, health and nutrition': never[];
            'Developmental projects and their impact on tribal displacement and problems of rehabilitation': string[];
            'Problems of exploitation and deprivation of Scheduled Castes, Scheduled Tribes and Other Backward Classes': string[];
            'Social change and contemporary tribal societies': string[];
            'The concept of ethnicity': string[];
            'Impact of Hinduism, Buddhism, Christianity, Islam and other religions on tribal societies': never[];
            'Tribe and nation state - a comparative study of tribal communities in India and other countries': never[];
            'History of administration of tribal areas, tribal policies, plans, programmes of tribal development and their implementation': string[];
            'Role of anthropology in tribal and rural development': never[];
            'Contributions of anthropology to the understanding of regionalism, communalism, and ethnic and political movements': never[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Economics: {
            'Advanced Micro Economics': string[];
            'Advanced Macro Economics': string[];
            'Money - Banking and Finance': string[];
            'International Economics': string[];
            'Growth and Development': string[];
            'Indian Economy in Pre-Independence Era': string[];
            'The Pre-Liberalization Era': string[];
            'The Post-Liberalization Era': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Law: {
            'Constitutional and Administrative Law': string[];
            'International Law': string[];
            'Law of Crimes': string[];
            'Law of Torts': string[];
            'Law of Contracts and Mercantile Law': string[];
            'Contemporary Legal Developments': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Philosophy: {
            'Plato and Aristotle: Ideas; Substance; Form and Matter; Causation; Actuality and Potentiality.': string[];
            'Social and Political Ideals: Equality, Justice, Liberty.': string[];
            'Notions of God: Attributes; Relation to Man and the World. (Indian and Western).': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Botany: {
            'Microbiology and Plant Pathology': string[];
            Cryptogams: string[];
            Phanerogams: string[];
            'Plant Resource Development': string[];
            Morphogenesis: string[];
            'Cell Biology': string[];
            'Genetics, Molecular Biology and Evolution': string[];
            'Plant Breeding, Biotechnology and Biostatistics': string[];
            'Physiology and Biochemistry': string[];
            'Ecology and Plant Geography': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        'Electrical Engineering': {
            'Circuit Theory': string[];
            'Signals & Systems': string[];
            'E.M. Theory': string[];
            'Analog Electronics': string[];
            'Digital Electronics': string[];
            'Energy Conversion': string[];
            'Power Electronics and Electric Drives': string[];
            'Analog Communication': string[];
            'Control Systems': string[];
            'Microprocessors and Microcomputers': string[];
            'Measurement and Instrumentation': string[];
            'Power Systems': string[];
            'Power System Protection': string[];
            'Digital Communication': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Zoology: {
            'Non-chordata and Chordata:': string[];
            'Ecology:': string[];
            'Ethology:': string[];
            'Economic Zoology:': string[];
            'Biostatistics:': string[];
            'Instrumentation Methods:': string[];
            'Cell Biology:': string[];
            'Genetics:': string[];
            'Evolution:': string[];
            'Systematics:': string[];
            'Biochemistry:': string[];
            'Physiology (with special reference to mammals):': string[];
            '7. Developmental Biology:': string[];
            'Gametogenesis; spermatogenesis, composition of semen, in vitro and in vivo capacitation of mammalian sperm, Oogenesis, totipotency; fertilization, morphogenesis and morphogen, blastogenesis, establishment of body axes formation, fate map, gestulation in frog and chick; genes in development in chick, homeotic genes, development of eye and heart, placenta in mammals.': never[];
            'Cell lineage, cell-to cell interaction, Genetic and induced teratogenesis, the role of thyroxine in control of metamorphosis in amphibia, paedogenesis and neoteny, cell death, ageing.': never[];
            'Developmental genes in man, in vitro fertilization and embryo transfer, cloning.': never[];
            'Stem cells: Sources, types and their use in human welfare.': never[];
            'Biogenetic law.': never[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Chemistry: {
            "Atomic Structure: Heisenberg's uncertainty principle, Schrodinger wave equation (time independent); Interpretation of wave function, particle in one-dimensional box, quantum numbers, hydrogen atom wave functions; Shapes of s, p and d orbitals.": string[];
            'Chemical Bonding: Ionic bond, characteristics of ionic compounds, lattice energy, Born-Haber cycle; covalent bond and its general characteristics, polarities of bonds in molecules and their dipole moments; Valence bond theory, concept of resonance and resonance energy; Molecular orbital theory (LCAO method); bonding in H2+, H2, He2+ to Ne2, NO, CO, HF, and CN-; Comparison of valence bond and molecular orbital theories, bond order, bond strength and bond length.': string[];
            "Solid State: Crystal systems; Designation of crystal faces, lattice structures and unit cell; Bragg's law; X-ray diffraction by crystals; Close packing, radius ratio rules, calculation of some limiting radius ratio values; Structures of NaCl, ZnS, CsCl and CaF2; Stoichiometric and nonstoichiometric defects, impurity defects, semi-conductors.": string[];
            "The Gaseous State and Transport Phenomenon: Equation of state for real gases, intermolecular interactions and critical phenomena and liquefaction of gases, Maxwell's distribution of speeds, intermolecular collisions, collisions on the wall and effusion; Thermal conductivity and viscosity of ideal gases.": string[];
            'Liquid State: Kelvin equation; Surface tension and surface energy, wetting and contact angle, interfacial tension and capillary action.': string[];
            'Thermodynamics: Work, heat and internal energy; first law of thermodynamics. Second law of thermodynamics; entropy as a state function, entropy changes in various processes, entropy-reversibility and irreversibility, Free energy functions; Thermodynamic equation of state; Maxwell relations; Temperature, volume and pressure dependence of U, H, A, G, Cp and Cv \u03B1 and \u03B2; J-T effect and inversion temperature; criteria for equilibrium, relation between equilibrium constant and thermodynamic quantities; Nerns theat theorem, introductory idea of third law of thermodynamics.': string[];
            'Phase Equilibria and Solutions: Clausius-Clapeyron equation; phase diagram for a pure substance; phase equilibria in binary systems, partially miscible liquids-upper and lower critical solution temperatures; partial molar quantities, their significance and determination; excess thermodynamic functions and their determination.': string[];
            'Electrochemistry: Debye-Huckel theory of strong electrolytes and Debye-Huckel limiting Law for various equilibrium and transport properties. Galvanic cells, concentration cells; electrochemical series, measurement of e.m.f. of cells and its applications fuel cells and batteries. Processes at electrodes; double layer at the interface; rate of charge transfer, current density; overpotential; electro-analytical techniques: Polarography, amperometry, ion selective electrodes and their uses.': string[];
            'Chemical Kinetics: Differential and integral rate equations for zeroth, first, second and fractional order reactions; Rate equations involving reverse, parallel, consecutive and chain reactions; branching chain and explosions; effect of temperature and pressure on rate constant; Study of fast reactions by stop-flow and relaxation methods; Collisions and transition state theories.': string[];
            'Photochemistry: Absorption of light; decay of excited state by different routes; photochemical reactions between hydrogen and halogens and their quantum yields.': string[];
            'Surface Phenomena and Catalysis: Absorption from gases and solutions on solid adsorbents, Langmuir and B.E.T. adsorption isotherms; determination of surface area, characteristics and mechanism of reaction on heterogeneous catalysts.': string[];
            'Bio-inorganic Chemistry: Metal ions in biological systems and their role in ion transport across the membranes (molecular mechanism), oxygenuptake proteins, cytochromes and ferredoxins.': string[];
            'Coordination Compounds: (i) Bonding theories of metal complexes; Valence bond theory, crystal field theory and its modifications; applications of theories in the explanation of magnetism and electronic spectra of metal complexes. (ii) Isomerism in coordination compounds; IUPAC nomenclature of coordination compounds; stereochemistry of complexes with 4 and 6 coordination numbers; chelate effect and polynuclear complexes; trans effect and its theories; kinetics of substitution reactions in square-planer complexes; thermodynamic and kinetic stability of complexes. (iii) EAN rule, Synthesis structure and reactivity of metal carbonyls; carboxylate anions, carbonyl hydrides and metal nitrosyl compounds. (iv) Complexes with aromatic systems, synthesis, structure and bonding in metal olefin complexes, alkyne complexes and cyclopentadienyl complexes; coordinative unsaturation, oxidative addition reactions, insertion reactions, fluxional molecules and their characterization; Compounds with metal-metal bonds and metal atom clusters.': string[];
            'Main Group Chemistry: Boranes, borazines, phosphazenes and cyclic phosphazene, silicates and silicones, Interhalogen compounds; Sulphur - nitrogen compounds, noble gas compounds.': string[];
            "General Chemistry of 'f' Block Elements: Lanthanides and actinides; separation, oxidation states, magnetic and spectral properties; lanthanide contraction.": string[];
            'Delocalised Covalent Bonding: Aromaticity, anti-aromaticity; annulenes, azulenes, tropolones, fulvenes, sydnones.': string[];
            'Reaction Mechanisms- General methods (both kinetic and non-kinetic) of study of mechanism of organic reactions: isotopic method, cross-over experiment, intermediate trapping, stereochemistry; energy of activation; thermodynamic control and kinetic control of reactions. Reactive Intermediates: Generation, geometry, stability and reactions of carbonium ions and carbanions, free radicals, carbenes, benzynes and nitrenes. Substitution Reactions: SN1, SN2 and SNi mechanisms; neighbouring group participation; electrophilic and nucleophilic reactions of aromatic compounds including heterocyclic compounds-pyrrole, furan, thiophene and indole. Elimination Reactions: E1, E2 and E1cb mechanisms; orientation in E2 reactions-Saytzeff and Hoffmann; pyrolytic syn elimination - Chugaev and Cope eliminations. Addition Reactions: Electrophilic addition to C=C and C=C; nucleophilic addition to C=0, C=N, conjugated olefins and carbonyls. Reactions and Rearrangements: Pinacol-pinacolone, Hoffmann, Beckmann, Baeyer-Villiger, Favorskii, Fries, Claisen, Cope, Stevens and WagnerMeerwein rearrangements. Aldol condensation, Claisen condensation, Dieckmann, Perkin, Knoevenagel, Witting, Clemmensen, Wolff-Kishner, Cannizzaro and von Richter reactions; Stobbe, benzoin and acyloin condensations; Fischer indole synthesis, Skraup synthesis, Bischler-Napieralski, Sandmeyer, Reimer-Tiemann and Reformatsky reactions.': string[];
            'Pericyclic Reactions: Classification and examples; Woodward Hoffmann rules - electro cyclic reactions, cycloaddition reactions [2+2 and 4+2] and sigma tropic shifts [1, 3; 3, 3 and 1, 5] FMO approach.': string[];
            'Preparation and Properties of Polymers: Organic polymers-polyethylene, polystyrene, polyvinyl chloride, teflon, nylon, terylene, synthetic and natural rubber.': string[];
            'Biopolymers: Structure of proteins, DNA and RNA.': string[];
            'Synthetic Uses of Reagents: OsO4, HIO4, CrO3, Pb(OAc)4, SeO2, NBS, B2H6, Na-Liquid NH3, LiAlH4, NaBH4, n-BuLi and MCPBA.': string[];
            'Photochemistry: Photochemical reactions of simple organic compounds, excited and ground states, singlet and triplet states, Norrish-Type I and Type II reactions.': string[];
            'Spectroscopy:': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Geography: {
            'Physical Geography': string[];
            'Human Geography': string[];
            'Geography Of India': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Maths: {
            'Linear Algebra': string[];
            Calculus: string[];
            'Analytic Geometry': string[];
            'Ordinary Differential Equations': string[];
            'Dynamics & Statics': string[];
            'Vector Analysis': string[];
            Algebra: string[];
            'Real Analysis': string[];
            'Complex Analysis': string[];
            'Linear Programming': string[];
            'Partial differential equations': string[];
            'Numerical Analysis and Computer programming': string[];
            'Mechanics and Fluid Dynamics': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Psychology: {
            Introduction: string[];
            'Methods of Psychology': string[];
            'Research methods': string[];
            'Development of Human Behaviour': string[];
            'Sensation, Attention and Perception': string[];
            Learning: string[];
            Memory: string[];
            'Thinking and Problem Solving': string[];
            'Motivation and Emotion': string[];
            'Intelligence and Aptitude': string[];
            Personality: string[];
            'Attitudes, Values and Interests': string[];
            'Language and Communication': string[];
            'Issues and Perspectives in Modern Contemporary Psychology': string[];
            'Psychological Measurement of Individual Differences': string[];
            'Psychological well being and Mental Disorders': string[];
            'Therapeutic Approaches': string[];
            'Work Psychology and Organisational Behaviour': string[];
            'Application of Psychology to Educational Field': string[];
            'Community Psychology': string[];
            'Rehabilitation Psychology': string[];
            'Application of Psychology to disadvantaged groups': string[];
            'The psychological problem of social integration': string[];
            'Application of Psychology in Information Technology and Mass Media': string[];
            'Psychology and Economic development': string[];
            'Application of Psychology to the environment and related fields': string[];
            'Application of psychology in other fields :': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        'Political Science': {
            'Political Theory': string[];
            'State Theories': string[];
            Justice: string[];
            Equality: string[];
            Rights: string[];
            Democracy: string[];
            'Concept of Power': string[];
            'Political Ideologies': string[];
            'Indian Political Thought': string[];
            'Western Political Thought': string[];
            'Indian Nationalism': string[];
            'Making of Indian Constitution': string[];
            'Features of the Indian Constitution': string[];
            'Organs of Union Government': string[];
            'Organs of State Government': string[];
            'Grassroots Democracy': string[];
            'Statutory Institutions/Commissions': string[];
            Federalism: string[];
            'Planning and Economic Development': string[];
            'Party System': string[];
            'Social Movement': string[];
            'Comparative Politics': string[];
            'State in Comparative Perspective': string[];
            'Politics of Representation and Participation': string[];
            Globalization: string[];
            'Approaches to Study of International Relations': string[];
            'Key Concepts in International Relations': string[];
            'Changing International Political Order': string[];
            'Evolution of the International Economic System': string[];
            'United Nations': string[];
            'World Politics Regionalization': string[];
            'Contemporary Global Concerns': string[];
            'Indian Foreign Policy': string[];
            'India\u2019s Contribution to Non-Alignment Movement': string[];
            'India and South Asia': string[];
            'India and Global Centres of Power': string[];
            'India and the UN system': string[];
            'India and Nuclear Question': string[];
            'Recent developments in the Foreign Policy of India': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Sociology: {
            'Sociology \u2013 The Discipline': string[];
            'Sociology as Science': string[];
            'Research Methods and Analysis': string[];
            'Sociological Thinkers': string[];
            'Stratification and Mobility': string[];
            'Works and Economic Life': string[];
            'Politics and Society': string[];
            'Religion and Society': string[];
            'Systems of Kinship': string[];
            'Social Change in Modern Society:': string[];
            'Introducing Indian Society: Perspectives on the study of Indian society': string[];
            'Introducing Indian Society: Impact of colonial rule on Indian society': string[];
            'Rural and Agrarian Social Structure': string[];
            'Caste System': string[];
            'Tribal communities in India': string[];
            'Social Classes in India': string[];
            'Systems of Kinship in India': string[];
            'Visions of Social Change in India': string[];
            'Rural and Agrarian transformation in India': string[];
            'Industrialization and Urbanisation in India': string[];
            'Social Movements in Modern India': string[];
            'Population Dynamics': string[];
            'Challenges of Social Transformation': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        'Animal Husbandry and Veterinary': {
            'Animal Nutrition': string[];
            'Animal Physiology': string[];
            'Animal Reproduction': string[];
            'Livestock Production and Management': string[];
            'Genetics and Animal Breeding': string[];
            'Anatomy, Pharmacology and Hygiene': string[];
            'Animal Diseases': string[];
            'Veterinary Public Health': string[];
            'Milk and Milk Products Technology': string[];
            'Meat Hygiene and Technology': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Physics: {
            Mechanics: string[];
            'Waves and Optics': string[];
            'Electricity and Magnetism': string[];
            'Electromagnetic Waves and Blackbody Radiation': string[];
            'Thermal and Statistical Physics': string[];
            'Quantum Mechanics': string[];
            'Atomic and Molecular Physics': string[];
            'Nuclear and Particle Physics': string[];
            'Solid State Physics, Devices and Electronics': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Statistics?: undefined;
        Management?: undefined;
    } | {
        Statistics: {
            Probability: string[];
            'Statistical Inference': string[];
            'Linear Inference and Multivariate Analysis': string[];
            'Sampling Theory and Design of Experiments': string[];
            'Industrial Statistics': string[];
            'Optimization Techniques': string[];
            'Quantitative Economics and Official Statistics': string[];
            'Demography and Psychometry': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Management?: undefined;
    } | {
        Management: {
            'Managerial Function and Process': string[];
            'Organisational Behaviour and Design': string[];
            'Human Resource Management': string[];
            'Accounting for Managers': string[];
            'Financial Management': string[];
            'Marketing Management': string[];
            'Quantitative Techniques in Decision-making': string[];
            'Production and Operations Management': string[];
            'Management Information System': string[];
            'Government Business Interface': string[];
            'Strategic Cost Management': string[];
            'International Business': string[];
        };
        Agriculture?: undefined;
        'Civil Engineering'?: undefined;
        Geology?: undefined;
        'Mechanical Engineering'?: undefined;
        Commerce?: undefined;
        History?: undefined;
        'Medical Science'?: undefined;
        'Public Administration'?: undefined;
        Anthropology?: undefined;
        Economics?: undefined;
        Law?: undefined;
        Philosophy?: undefined;
        Botany?: undefined;
        'Electrical Engineering'?: undefined;
        Zoology?: undefined;
        Chemistry?: undefined;
        Geography?: undefined;
        Maths?: undefined;
        Psychology?: undefined;
        'Political Science'?: undefined;
        Sociology?: undefined;
        'Animal Husbandry and Veterinary'?: undefined;
        Physics?: undefined;
        Statistics?: undefined;
    })[];
};

declare const mapTagTypeToNumber: any;
declare const mapTagTypeToCategories: any;

type MatchingBlock = {
    text: string;
    boundingBox: any;
};
type PageResult = {
    page_number: number;
    s3_img_object_name?: string;
    clean_text?: string;
    s3_signed_url?: string;
    matching_words?: string[];
    matching_blocks?: MatchingBlock[];
    /**
     * height of the page returned by Vision API OCR
     */
    height?: number;
    /**
     * width of the page returned by Vision API OCR
     */
    width?: number;
};
type Result = {
    _id?: string;
    s3_object_name: string;
    num_pages: number;
    document_type: number | null;
    topper?: {
        name?: string;
        rank?: number;
        year?: number;
    };
    pages: PageResult[];
    s3_signed_url?: string;
    l0_categories?: number[];
};

interface TagValue {
    tagText: string;
}
type TagType = "GS1" | "GS2" | "GS3" | "GS4" | "Essay" | "Optionals";
type TagLevel = "l0" | "l1" | "l2";
interface Tag {
    type: TagType;
    level: TagLevel;
    value: TagValue;
    optionalsId?: number;
}
type DocumentType = -1 | 0 | 1 | 2;
type Topper = {
    name?: string;
    rank?: number;
    year?: number;
};
interface SearchParams {
    keyword?: string;
    subjectTags?: Tag[];
    documentType?: DocumentType;
    topper?: Topper;
    year?: number;
    favourites?: boolean;
    pageNumber?: number;
}

type ApiError = {
    error: boolean;
    message: string;
};

export { type ApiError, type DocumentType, type MatchingBlock, type PageResult, type Result, type SearchParams, type Tag, type TagLevel, type TagType, type TagValue, type Topper, gs1Categories, gs2Categories, gs3Categories, gs4Categories, mapTagTypeToCategories, mapTagTypeToNumber, optionalsCategories };
