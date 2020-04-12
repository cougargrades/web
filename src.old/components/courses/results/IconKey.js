// Maps departments to material icons https://material.io/tools/icons/
// UH catalog: http://publications.uh.edu/content.php?catoid=31&navoid=11769

import React from 'react';

//import _ from '@material-ui/icons/_'
import TrendingDown from '@material-ui/icons/TrendingDown';
import Translate from '@material-ui/icons/Translate';
import Brush from '@material-ui/icons/Brush';
import NaturePeople from '@material-ui/icons/NaturePeople';
import Build from '@material-ui/icons/Build';
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver';
import Computer from '@material-ui/icons/Computer';
import Memory from '@material-ui/icons/Memory';
import TrendingUp from '@material-ui/icons/TrendingUp';
import Subject from '@material-ui/icons/Subject';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Public from '@material-ui/icons/Public';
import Business from '@material-ui/icons/Business';
import Gavel from '@material-ui/icons/Gavel';
import Functions from '@material-ui/icons/Functions';
import MusicNote from '@material-ui/icons/MusicNote';
import DirectionsBoat from '@material-ui/icons/DirectionsBoat';
import Language from '@material-ui/icons/Language';
import BarChart from '@material-ui/icons/BarChart';
import LibraryBooks from '@material-ui/icons/LibraryBooks';

export class IconMapper extends React.Component {
    render() {
        return React.createElement(definitions[this.props.dept], { className: "cg-icon" });
    }
}

export const definitions = {
    AAS: null, // African American Study
    ACCT: TrendingDown, // Accounting
    AFSC: null, // Air Force Science
    AMER: null, // American Cultures
    ANTH: null, // Anthropology 
    ARAB: Translate, // Arabic
    ARCH: null, // Architecture
    ARED: null, // Art Education
    ARLD: null, // Arts Leadership
    ART: Brush, // Art
    ARTH: null, // Art History
    ASLI: null, // 
    ATP: null, // 
    BCHS: null, // 
    BIOE: Build, // 
    BIOL: NaturePeople, // 
    BTEC: null, // 
    BZAN: null, // 
    CCS: null, // 
    CHEE: Build, // 
    CHEM: {src: "https://cdn.jsdelivr.net/npm/open-iconic@1.1.1/svg/beaker.svg"}, // 
    CHNS: Translate, // 
    CIS: null, // 
    CIVE: Build, // 
    CLAS: null, // 
    CNST: null, // 
    COMD: null, // 
    COMM: RecordVoiceOver, // 
    CORE: null, // 
    COSC: Computer, // 
    CUIN: null, // 
    CUST: null, // 
    DAN: null, // 
    DIGM: null, // 
    ECE: Memory, // 
    ECON: TrendingUp, // 
    EDRS: null, // 
    EDUC: null, // 
    EGRP: null, // 
    ELCS: null, // 
    ELED: null, // 
    ELET: null, // 
    ENGI: null, // 
    ENGL: Subject, // 
    ENRG: Build, // 
    ENTR: null, // 
    EPSY: null, // 
    FINA: AttachMoney, // 
    FORE: null, // 
    FREN: Translate, // 
    GCEE: null, // 
    GENB: null, // 
    GEOL: Public, // 
    GERM: Translate, // 
    GIS: null, // 
    GLBT: null, // 
    GREK: Translate, // 
    GRET: null, // 
    HDCS: null, // 
    HDFS: null, // 
    HIND: Translate, // 
    HISP: null, // 
    HIST: LibraryBooks, // 
    HLT: null, // 
    HON: null, // 
    HRD: null, // 
    HRMA: Business, // 
    IART: null, // 
    IDNS: null, // 
    IGS: null, // 
    ILAS: null, // 
    INAR: null, // 
    INDE: Build, // 
    INDS: null, // 
    INTB: null, // 
    IRW: null, // 
    ITAL: Translate, // 
    ITEC: null, // 
    JPNS: Translate, // 
    JWST: null, // 
    KIN: null, // 
    LAAF: null, // 
    LACP: null, // 
    LAST: null, // 
    LATN: Translate, // 
    LAW: Gavel, // 
    MANA: Business, // 
    MARK: null, // 
    MAS: null, // 
    MATH: Functions, // 
    MECE: Build, // 
    MECT: null, // 
    MIS: null, // 
    MSCI: null, // 
    MTLS: null, // 
    MUED: null, // 
    MUSA: null, // 
    MUSI: MusicNote, // 
    NAVY: DirectionsBoat, // 
    NURS: null, // 
    NUTR: null, // 
    OPTO: null, // 
    PCEU: null, // 
    PCOL: null, // 
    PEB: null, // 
    PEP: null, // 
    PES: null, // 
    PETR: Build, // 
    PHAR: null, // 
    PHCA: null, // 
    PHIL: null, // 
    PHLA: null, // 
    PHLS: null, // 
    PHOP: null, // 
    PHYS: null, // 
    POLC: null, // 
    POLS: Language, // 
    PSYC: null, // 
    PUBL: null, // 
    QSS: null, // 
    RELS: null, // 
    RUSS: Translate, // 
    SAER: null, // 
    SCLT: null, // 
    SCM: null, // 
    SEDE: null, // 
    SOC: null, // 
    SOCW: null, // 
    SPAC: null, // 
    SPAN: null, // 
    SPEC: null, // 
    STAT: BarChart, // 
    SUBS: null, // 
    TECH: null, // 
    TELS: null, // 
    TEPM: null, // 
    THEA: null, // 
    TMTH: null, // 
    TURK: null, // 
    UNIV: null, // 
    VIET: null, // 
    WCL: null, // 
    WGSS: null, // 
    WOST: null, // 
}