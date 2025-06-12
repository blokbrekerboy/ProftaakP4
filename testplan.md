# Testplan - Oldskool Game

## Projectinformatie
- **Projectnaam**: project p4 oldskool game
- **Teamleden**: Robin Linders, Gijs Verschuren
- **Datum**: Juni 2025
- **Versie**: 1.0

## 1. Testdoelstellingen

### 1.1 Hoofddoelstellingen
- Controleren of alle game functionaliteiten correct werken
- Valideren van de gebruikerservaring
- Identificeren van bugs en performance problemen
- Controleren van browser compatibiliteit

### 1.2 Testscope
- **In scope**: Game logica, UI functionaliteit, besturing, collision detection
- **Out of scope**: Server-side functionaliteiten (niet van toepassing)

## 2. Teststrategie

### 2.1 Testtypen
1. **Functionele Tests**: Controleren of features werken zoals bedoeld
2. **Usability Tests**: Gebruikerservaring en interface testen
3. **Performance Tests**: Frame rate en responsiviteit
4. **Compatibility Tests**: Browser ondersteuning

### 2.2 Testomgevingen
- **Browsers**: Chrome, Firefox
- **Devices**: Desktop
- **Operating Systems**: Windows, Linux

## 3. Testcases

### 3.1 Game Start en Initialisatie
| Test ID | Beschrijving | Verwacht Resultaat | Status |
|---------|--------------|-------------------|--------|
| TC001 | Game laadt correct | Game interface wordt getoond | [ ] |
| TC002 | Start knop werkt | Game begint na klikken | [ ] |
| TC003 | Canvas wordt correct weergegeven | 800x600 canvas zichtbaar | [ ] |

### 3.2 Speler Besturing
| Test ID | Beschrijving | Verwacht Resultaat | Status |
|---------|--------------|-------------------|--------|
| TC004 | Linker pijl beweging | Speler beweegt naar links | [ ] |
| TC005 | Rechter pijl beweging | Speler beweegt naar rechts | [ ] |
| TC006 | Omhoog pijl beweging | Speler beweegt omhoog | [ ] |
| TC007 | Omlaag pijl beweging | Speler beweegt omlaag | [ ] |
| TC008 | WASD toetsen werken | Alternatieve besturing werkt | [ ] |
| TC009 | Spatiebalk schieten | Projectiel wordt afgevuurd | [ ] |
| TC010 | Speler blijft binnen scherm | Grenzen worden gerespecteerd | [ ] |

### 3.3 Vijanden
| Test ID | Beschrijving | Verwacht Resultaat | Status |
|---------|--------------|-------------------|--------|
| TC011 | Vijanden spawnen | Vijanden verschijnen regelmatig | [ ] |
| TC012 | Vijand beweging | Vijanden bewegen naar beneden | [ ] |
| TC013 | Verschillende vijandtypes | Basic, Fast, Tank, Shooter types | [ ] |
| TC014 | Vijand AI gedrag | Verschillende bewegingspatronen | [ ] |

### 3.4 Collision Detection
| Test ID | Beschrijving | Verwacht Resultaat | Status |
|---------|--------------|-------------------|--------|
| TC015 | Speler raakt vijand | Speler neemt schade | [ ] |
| TC016 | Projectiel raakt vijand | Vijand verdwijnt, score stijgt | [ ] |
| TC017 | Vijand projectiel raakt speler | Speler neemt schade | [ ] |

### 3.5 Game Mechanics
| Test ID | Beschrijving | Verwacht Resultaat | Status |
|---------|--------------|-------------------|--------|
| TC018 | Score systeem | Score verhoogt bij vijand eliminatie | [ ] |
| TC019 | Level progressie | Level stijgt na bepaalde score | [ ] |
| TC020 | Health systeem | Health bar toont correcte waarde | [ ] |
| TC021 | Game Over conditie | Game stopt bij 0 health | [ ] |

### 3.6 UI Functionaliteit
| Test ID | Beschrijving | Verwacht Resultaat | Status |
|---------|--------------|-------------------|--------|
| TC022 | Pause functie | Game pauzeerd/hervat correct | [ ] |
| TC023 | Reset functie | Game reset naar begin state | [ ] |
| TC024 | Score display | Score wordt correct getoond | [ ] |
| TC025 | Level display | Level wordt correct getoond | [ ] |

### 3.7 Performance Tests
| Test ID | Beschrijving | Verwacht Resultaat | Status |
|---------|--------------|-------------------|--------|
| TC026 | Frame rate | Stabiele 60 FPS | [ ] |
| TC027 | Memory usage | Geen memory leaks | [ ] |
| TC028 | Veel objecten op scherm | Geen performance degradatie | [ ] |

### 3.8 Browser Compatibility
| Test ID | Beschrijving | Verwacht Resultaat | Status |
|---------|--------------|-------------------|--------|
| TC029 | Chrome compatibiliteit | Alle features werken | [ ] |
| TC030 | Firefox compatibiliteit | Alle features werken | [ ] |
| TC031 | Edge compatibiliteit | Alle features werken | [ ] |
| TC032 | Safari compatibiliteit | Alle features werken | [ ] |

## 4. Bug Rapportage Template

### Bug Rapport
- **Bug ID**: [Uniek nummer]
- **Titel**: [Korte beschrijving]
- **Beschrijving**: [Gedetailleerde beschrijving]
- **Stappen om te reproduceren**:
  1. [Stap 1]
  2. [Stap 2]
  3. [Stap 3]
- **Verwacht resultaat**: [Wat zou moeten gebeuren]
- **Werkelijk resultaat**: [Wat er gebeurt]
- **Prioriteit**: Hoog/Gemiddeld/Laag
- **Status**: Open/In behandeling/Opgelost
- **Browser/OS**: [Informatie over testomgeving]

## 5. Test Uitvoering

### 5.1 Test Schema
- **Test Datum**: [Datum]
- **Tester**: [Naam]
- **Test Omgeving**: [Browser + OS]
- **Build Versie**: [Versie nummer]

### 5.2 Test Resultaten
- **Totaal Testcases**: 32
- **Geslaagd**: [Aantal]
- **Gefaald**: [Aantal]
- **Overgeslagen**: [Aantal]

## 6. Acceptatie Criteria

### 6.1 Minimum Acceptable Quality
- **90%** van functionele tests moet slagen
- **Geen** critical bugs
- **Maximaal 3** medium priority bugs
- Game moet werken in **minimaal 3** browsers

### 6.2 Go-Live Criteria
- Alle high priority bugs opgelost
- Performance tests voldoen aan eisen
- Gebruikersfeedback is positief

## 7. Test Deliverables

- **Testplan** (dit document)
- **Test Execution Report**
- **Bug Reports**
- **Test Coverage Report**

---

**Opmerking**: Dit testplan wordt bijgewerkt na elke test iteratie.
