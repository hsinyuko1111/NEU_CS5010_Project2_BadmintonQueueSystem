# Badminton Lining System: Business Requirements

## 1. Introduction

The Badminton Lining System is designed to streamline player rotations efficiently at a badminton court. It ensures fair playtime and seamless match management by providing two distinct game modes: Quick Start Mode and Timer Mode. This system enhances user experience by allowing players to track their turn, manage game durations, and automate lineup movements.

With the growing popularity of badminton at recreational clubs and professional venues, efficient court management has become essential. Current manual rotation systems often lead to confusion, unequal court time, and frustration among players waiting for their turn.

### Objectives

- Facilitate smooth player rotations on a badminton court.
- Provide an intuitive interface for joining and managing lineups.
- Ensure fair game durations through an automated timer system.
- Enhance user convenience with player registration and login persistence.
- Reduce administrative overhead for court managers and organizers.

## 2. Core Features

### Quick Start Mode

- Players line up in groups and start matches instantly.
- Once a group finishes playing, their names turn grey and move back to the left sidebar.
- Ensures continuous gameplay without manual intervention.
- **Benefits**: Minimizes downtime between matches and reduces administrative overhead.

### Timer Mode

- A 20-minute countdown timer starts when a match begins.
- The Start button changes to Restart, allowing players to reset the timer back to 20:00.
- Players can also manually End the game early, sending players back to the left sidebar.
- Ensures fair court usage by limiting match durations.
- **Benefits**: Promotes equal court access and prevents court monopolization.

### Player Management

- Registered players' names appear on the left sidebar upon login.
- Players can join a lineup by selecting an empty spot in a four-row grid and choosing their name.
- After each match, players automatically return to the waiting list for smooth rotations.
- **Benefits**: Creates a transparent queue system that all participants can monitor.

**Note**: Quick Start Mode and Timer Mode can be selected on a per-court basis and cannot run simultaneously on the same court.

## 3. Target Audience

### Primary Users:

- **Badminton Players** – Want to track their turn and ensure fair playtime. Need clear indication of waiting time and position in queue.
- **Court Organizers** – Need a structured system for managing rotations efficiently and handling exceptions.
- **Club Administrators** – Want to maintain accurate records of registered players and monitor court usage patterns.

### Secondary Users:

- **Spectators** – May want to view upcoming matches and player rotations.
- **Club Members** – May want to check court availability and current lineup remotely before arriving.
- **Facility Managers** – Need data on court usage for maintenance scheduling and resource allocation.

## 4. Rules

- Players must register and log in to have their names appear on the left sidebar.
- To join a lineup, players click an empty grid spot and select their name.
- The system accommodates doubles (4 players) formats.

### In Quick Start Mode:

- Clicking Start begins the match.
- After the match, players' names turn grey and move back to the left sidebar.


### In Timer Mode:

- Clicking Start begins the countdown from 20:00.
- The Restart button resets the timer back to 20:00.
- The End button ends the game prematurely and returns players to the waiting list.
- Visual and audio alerts notify players when time expires.

### Exception Handling:

- In case of an odd number of players, the system will highlight the need for one more player before a match can begin.
- Players can form partial groups while waiting for additional members to join.

## 5. Acceptance Criteria

### Quick Start Mode
- AC1: Players must be able to form groups of 4 and begin matches within 3 clicks.
- AC2: When a match ends, player names should automatically turn grey and move to waiting list within 5 seconds.
- AC3: The system must maintain the original order of players in the waiting list.
- AC4: The system must visually indicate which courts are currently active.

### Timer Mode
- AC1: Timer must start at exactly 20:00 and count down in 1-second intervals.
- AC2: An audible notification must sound when time expires.
- AC3: The Restart button must reset the timer to 20:00 without affecting player positions.
- AC4: The End button must immediately terminate the current match and return players to the waiting list.
- AC5: Timer accuracy must remain within 2 seconds of actual elapsed time over a 20-minute period.

### Player Management
- AC1: New player registration must require unique names to avoid conflicts.
- AC2: The system must accommodate at least 50 active players in the waiting list.
- AC3: Player login status must persist for at least 8 hours.
- AC4: The system must visually differentiate between available and unavailable players.
- AC5: Players must be able to remove themselves from the lineup with a single action.
- AC6: The system must prevent players from joining multiple lineups simultaneously.


## 6. Challenge Questions & Considerations

- How can we balance efficiency and fairness in player rotations?
  - Implement automated player cycling based on game mode.
  - Provide transparent queue visibility to all players.

- How can we ensure the interface remains intuitive for all users?
  - Provide clear visual indicators for active, inactive, and queued players.
  - Use color-coding and simple iconography to denote player statuses.

- How can we improve convenience for returning players?
  - Enable persistent login so that registered players don't need to re-enter details.
  - Implement "remember me" functionality with appropriate security measures.

- How can the system handle peak usage times?
  - Implement performance optimization for high-traffic periods.
  - Consider feature for pre-booking time slots during known busy periods.

## 7. Implementation Considerations

- **Mobile Responsiveness**: The system must function on devices ranging from smartphones to large tablets with adaptive layouts.
- **Data Storage**: Player profiles and match history should be stored for at least 6 months.
- **Performance Requirements**: System must handle 100 concurrent users with response times under 2 seconds.
- **Offline Capability**: Basic functionality should work even with intermittent connectivity.
- **Security**: Player contact information must be protected with appropriate encryption and access controls.

## 8. Nouns and Verbs Analysis

### Nouns (Entities in the System)

Player, Court, Lineup, Mode, Grid, Sidebar, Match, Name, Timer, Button, System, Administrator, Rotation, Session.

### Verbs (System Actions)

Register, Login, Join, Click, Select, Start, Restart, End, Move, Reset, Track, Display, Rotate, Manage.

## 9. User Classification & Personas

### User Classification Dimensions

**Engagement Level** – Measures how actively users interact with the badminton lining system
- High: Actively participates in matches, uses advanced features, and engages regularly
- Low: Basic participation, minimal feature usage, occasional engagement

**Experience Level** – Indicates users' familiarity with badminton and court systems
- Expert: Experienced players familiar with rotation systems
- Intermediate: Regular players with moderate experience
- Beginner: New to badminton or court rotation systems

**Usage Frequency** – How often users access the system
- Regular: Uses the system multiple times per week
- Occasional: Uses the system a few times per month
- Rare: Infrequent usage

**Administrative Role** – Defines users' administrative responsibilities
- Organizer: Manages court rotations and system settings
- Player: Participates in games without administrative duties

### User Personas

#### 1. Alex, the Casual Player
**Age:** 28  
**Background:** Works in marketing, plays badminton on weekends for recreation  
**Engagement Level:** Low – Joins games but rarely uses advanced features  
**Experience Level:** Intermediate  
**Usage Frequency:** Occasional  
**Administrative Role:** Player  

**Scenario:** Wants to enjoy recreational games without dealing with organizational hassles  
**Reason to use the system:** Prefers structured rotations to ensure fair play time  
**Pain Points:**
- Gets frustrated when waiting times are unpredictable
- Doesn't want to manually track when it's his turn to play
- Prefers minimal interaction with technology during sports activities

**Key Features Needed:**
- Simple interface for joining lineups
- Clear visual indication of queue position
- Automatic notifications when it's his turn to play

#### 2. Sam, the Court Organizer
**Age:** 42  
**Background:** Badminton club administrator who manages multiple courts  
**Engagement Level:** High – Regularly uses administrative features  
**Experience Level:** Expert  
**Usage Frequency:** Regular  
**Administrative Role:** Organizer  

**Scenario:** Oversees rotation management for a busy badminton club  
**Reason to use the system:** Needs to automate player rotations to reduce administrative burden  
**Pain Points:**
- Spends too much time manually organizing player rotations
- Struggles to ensure fair playtime during busy periods
- Needs to resolve conflicts when players dispute court usage

**Key Features Needed:**
- Administrative dashboard with court overview
- Override capabilities for special circumstances
- Access to usage statistics and patterns
- Ability to adjust timer settings for different sessions

#### 3. Jordan, the Competitive Player
**Age:** 31  
**Background:** Former college athlete who plays badminton competitively  
**Engagement Level:** High – Uses timer mode and tracks personal statistics  
**Experience Level:** Expert  
**Usage Frequency:** Regular  
**Administrative Role:** Player  

**Scenario:** Participates in regular practice sessions and wants equal court time  
**Reason to use the system:** Needs strict time management for fair play rotation  
**Pain Points:**
- Frustrated when other players exceed their allotted time
- Wants to track match history to measure improvement
- Needs advance notice when his turn is approaching

**Key Features Needed:**
- Timer mode with strict enforcement
- Performance statistics and match history
- Notification system for upcoming rotations
- Integration with personal fitness tracking

#### 4. Lisa, the Beginner Player
**Age:** 25  
**Background:** New to badminton, learning the sport and club protocols  
**Engagement Level:** Low – Basic system interactions only  
**Experience Level:** Beginner  
**Usage Frequency:** Occasional  
**Administrative Role:** Player  

**Scenario:** Trying to navigate both the sport and the court rotation system  
**Reason to use the system:** Needs guidance on when and how to join games  
**Pain Points:**
- Feels intimidated by complicated rotation systems
- Unsure about badminton etiquette and lineup procedures
- Worries about making mistakes when using the system

**Key Features Needed:**
- Tutorial or help section explaining the system
- Simple, guided interface for joining lineups
- Undo functionality for accidental selections
- Visual cues for where to go and what to do next

## 10. User Stories

### Persona 1: Alex, the Casual Player

**User Stories:**
- "As a badminton player, I want to join a lineup with my group so that I can track when it's my turn to play."
- "As a badminton player, I want to see my name in the lineup so that I can ensure my participation."
- "As a badminton player, I want an intuitive UI so that I can easily navigate and join a game."

### Persona 2: Sam, the Court Organizer

**User Stories:**
- "As a court organizer, I want a quick start mode that instantly moves players back to the waiting list after their game so that I can maintain a smooth rotation."
- "As a court organizer, I want an overview of the lineup so that I can monitor game progress efficiently."
- "As a court organizer, I want the ability to remove inactive players from the lineup so that I can keep the system organized."

### Persona 3: Jordan, the Competitive Player

**User Stories:**
- "As a competitive player, I want to use timer mode to ensure fair playtime so that no one overuses the court."
- "As a competitive player, I want my match history available so that I can analyze my performance."
- "As a competitive player, I want notifications for when my turn is coming up so that I don't miss my match."

### Persona 4: Lisa, the Beginner Player

**User Stories:**
- "As a beginner player, I want a clear and simple way to join a game so that I don't feel overwhelmed when trying to participate."
- "As a beginner player, I want a help section explaining the lineup process so that I can understand how to use the system."
- "As a beginner player, I want to be able to undo my selection in case I click on the wrong lineup slot."

## 11. AI Usage - Q&A with ChatGPT 4oT


### Enhancements through AI

- **Smart Rotation Suggestions** – AI predicts optimal lineup arrangements based on past participation.
- **Fairness Monitoring** – AI detects and prevents repeated overuse of court time by the same players.
- **Personalized Player Insights** – AI provides match history and performance trends.
- **Peak Time Prediction** – AI analyzes usage patterns to help facility managers optimize court availability.
- **Skill-Based Matching** – Optional feature to suggest balanced player groupings based on observed play patterns.

- ** 1 - Business Requirements **
Q: “Generate a Business Requirement Document based on this project proposal.”
A: ChatGPT structured the document into sections, including Introduction, Core Features, Target Audience, Rules, Challenge Questions, Implementation Considerations, and User Personas.

- ** 2 - Classifying Nouns & Verbs into Classes and Attributes **
Q: “Is this class separation correct based on these nouns and verbs?”
A: ChatGPT refined the classification of system entities (e.g., Player, Court, Timer) and system actions (e.g., join, start, restart) to ensure they aligned properly with object-oriented principles.

- ** 3 - User Classification & Ranking **
Q: “Consider user classification using their level of interest in the system, how often they use it, the type of device they will use, and their role in content.”
A: ChatGPT categorized users based on engagement level, experience, usage frequency, and administrative role, helping define the needs of players, organizers, and club administrators.

- ** 4 - Creating User Personas **
Q: “Generate User Persona based on this table for me.” (The table is shown in the previous section)
A: ChatGPT generated four detailed user personas:

Alex, the Casual Player
Sam, the Court Organizer
Jordan, the Competitive Player
Lisa, the Beginner Player
Each persona included age, background, engagement level, experience level, usage frequency, administrative role, scenario, pain points, and key features needed.

- ** 5 - User Stories **
Q: “Create three user stories for each persona.”
A: ChatGPT developed three user stories per persona, ensuring that their primary needs were addressed. Examples:

"As a competitive player, I want to use timer mode to ensure fair playtime so that no one overuses the court."
"As a beginner player, I want a help section explaining the lineup process so that I can understand how to use the system."

## 12. Conclusion

The Badminton Lining System enhances efficiency, fairness, and user experience for managing court rotations. By integrating automated lineup management, real-time timers, and persistent player data, this system ensures smooth gameplay and equal access for all participants. Future AI enhancements will further optimize court usage and player tracking, making it an invaluable tool for badminton enthusiasts and organizers alike.

The comprehensive acceptance criteria ensure that development efforts remain focused on delivering a system that truly meets user needs while maintaining high performance standards. By addressing both technical requirements and user experience considerations, the Badminton Lining System will significantly improve court management for all stakeholders.
