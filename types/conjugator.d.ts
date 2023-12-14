export default Conjugator;
declare class Conjugator {
    constructor(parent: any);
    RiTa: any;
    allVerbs: any;
    verbsEndingInE: any;
    verbsEndingInDouble: any;
    conjugate(verb: any, args: any): any;
    unconjugate(word: any, opts?: {}): any;
    presentPart(theVerb: any): any;
    pastPart(theVerb: any): any;
    toString(): string;
    _reset(): void;
    IRREG_VERBS_LEX_VB: {
        abetted: string;
        abetting: string;
        abhorred: string;
        abhorring: string;
        abode: string;
        accompanied: string;
        acidified: string;
        acquitted: string;
        acquitting: string;
        addrest: string;
        admitted: string;
        admitting: string;
        allotted: string;
        allotting: string;
        am: string;
        amplified: string;
        annulled: string;
        annulling: string;
        applied: string;
        arcked: string;
        arcking: string;
        are: string;
        arisen: string;
        arose: string;
        ate: string;
        atrophied: string;
        awoke: string;
        awoken: string;
        bade: string;
        bagged: string;
        bagging: string;
        bandied: string;
        banned: string;
        banning: string;
        barred: string;
        barrelled: string;
        barrelling: string;
        barring: string;
        batted: string;
        batting: string;
        beaten: string;
        beautified: string;
        became: string;
        bed: string;
        bedded: string;
        bedding: string;
        bedevilled: string;
        bedevilling: string;
        been: string;
        befallen: string;
        befell: string;
        befitted: string;
        befitting: string;
        began: string;
        begat: string;
        begetting: string;
        begged: string;
        begging: string;
        beginning: string;
        begot: string;
        begotten: string;
        begun: string;
        beheld: string;
        beholden: string;
        belying: string;
        benefitted: string;
        benefitting: string;
        bent: string;
        bespoke: string;
        bespoken: string;
        betted: string;
        betting: string;
        bevelled: string;
        bevelling: string;
        biassed: string;
        biassing: string;
        bidden: string;
        bidding: string;
        bit: string;
        bitted: string;
        bitten: string;
        bitting: string;
        bled: string;
        blest: string;
        blew: string;
        blipped: string;
        blipping: string;
        blotted: string;
        blotting: string;
        blown: string;
        blurred: string;
        blurring: string;
        bore: string;
        born: string;
        bought: string;
        bound: string;
        bragged: string;
        bragging: string;
        bred: string;
        broke: string;
        broken: string;
        brought: string;
        browbeaten: string;
        budded: string;
        budding: string;
        bugged: string;
        bugging: string;
        built: string;
        bullied: string;
        bummed: string;
        bumming: string;
        buried: string;
        burnt: string;
        bypast: string;
        calcified: string;
        came: string;
        cancelled: string;
        cancelling: string;
        canned: string;
        canning: string;
        capped: string;
        capping: string;
        carried: string;
        caught: string;
        certified: string;
        channelled: string;
        channelling: string;
        charred: string;
        charring: string;
        chatted: string;
        chatting: string;
        chid: string;
        chidden: string;
        chinned: string;
        chinning: string;
        chiselled: string;
        chiselling: string;
        chopped: string;
        chopping: string;
        chose: string;
        chosen: string;
        chugged: string;
        chugging: string;
        clad: string;
        clarified: string;
        classified: string;
        clipped: string;
        clipping: string;
        clogged: string;
        clogging: string;
        clung: string;
        "co-ordinate": string;
        "co-ordinated": string;
        "co-ordinates": string;
        "co-ordinating": string;
        codified: string;
        combatted: string;
        combatting: string;
        committed: string;
        committing: string;
        compelled: string;
        compelling: string;
        complied: string;
        concurred: string;
        concurring: string;
        conferred: string;
        conferring: string;
        controlled: string;
        controlling: string;
        copied: string;
        corralled: string;
        corralling: string;
        counselled: string;
        counselling: string;
        crammed: string;
        cramming: string;
        crept: string;
        cried: string;
        cropped: string;
        cropping: string;
        crucified: string;
        cupped: string;
        cupping: string;
        curried: string;
        curst: string;
        cutting: string;
        dallied: string;
        dealt: string;
        decried: string;
        deferred: string;
        deferring: string;
        defied: string;
        demurred: string;
        demurring: string;
        denied: string;
        deterred: string;
        deterring: string;
        detoxified: string;
        dialled: string;
        dialling: string;
        did: string;
        digging: string;
        dignified: string;
        dimmed: string;
        dimming: string;
        dipped: string;
        dipping: string;
        dirtied: string;
        dispelled: string;
        dispelling: string;
        disqualified: string;
        dissatisfied: string;
        diversified: string;
        divvied: string;
        dizzied: string;
        done: string;
        donned: string;
        donning: string;
        dotted: string;
        dotting: string;
        dove: string;
        dragged: string;
        dragging: string;
        drank: string;
        drawn: string;
        dreamt: string;
        drew: string;
        dried: string;
        dripped: string;
        dripping: string;
        driven: string;
        dropped: string;
        dropping: string;
        drove: string;
        drubbed: string;
        drubbing: string;
        drummed: string;
        drumming: string;
        drunk: string;
        dubbed: string;
        dubbing: string;
        duelled: string;
        duelling: string;
        dug: string;
        dwelt: string;
        dying: string;
        eaten: string;
        eavesdropped: string;
        eavesdropping: string;
        electrified: string;
        embedded: string;
        embedding: string;
        embodied: string;
        emitted: string;
        emitting: string;
        emptied: string;
        enthralled: string;
        enthralling: string;
        envied: string;
        equalled: string;
        equalling: string;
        equipped: string;
        equipping: string;
        excelled: string;
        excelling: string;
        exemplified: string;
        expelled: string;
        expelling: string;
        extolled: string;
        extolling: string;
        fallen: string;
        falsified: string;
        fancied: string;
        fanned: string;
        fanning: string;
        fed: string;
        feed: string;
        fell: string;
        felt: string;
        ferried: string;
        fitted: string;
        fitting: string;
        flagged: string;
        flagging: string;
        fled: string;
        flew: string;
        flipped: string;
        flipping: string;
        flitted: string;
        flitting: string;
        flopped: string;
        flopping: string;
        flown: string;
        flung: string;
        fogged: string;
        fogging: string;
        forbad: string;
        forbade: string;
        forbidden: string;
        forbidding: string;
        foregone: string;
        foresaw: string;
        foreseen: string;
        foretold: string;
        forewent: string;
        forgave: string;
        forgetting: string;
        forgiven: string;
        forgone: string;
        forgot: string;
        forgotten: string;
        forsaken: string;
        forsook: string;
        fortified: string;
        forwent: string;
        fought: string;
        found: string;
        fretted: string;
        fretting: string;
        fried: string;
        frolicked: string;
        frolicking: string;
        froze: string;
        frozen: string;
        fuelled: string;
        fuelling: string;
        funnelled: string;
        funnelling: string;
        gapped: string;
        gapping: string;
        gassed: string;
        gasses: string;
        gassing: string;
        gave: string;
        gelled: string;
        gelling: string;
        getting: string;
        girt: string;
        given: string;
        glorified: string;
        glutted: string;
        glutting: string;
        gnawn: string;
        gone: string;
        got: string;
        gotten: string;
        grabbed: string;
        grabbing: string;
        gratified: string;
        grew: string;
        grinned: string;
        grinning: string;
        gripped: string;
        gripping: string;
        gript: string;
        gritted: string;
        gritting: string;
        ground: string;
        grovelled: string;
        grovelling: string;
        grown: string;
        gummed: string;
        gumming: string;
        gunned: string;
        gunning: string;
        had: string;
        handicapped: string;
        handicapping: string;
        harried: string;
        has: string;
        heard: string;
        held: string;
        hewn: string;
        hid: string;
        hidden: string;
        hitting: string;
        hobnobbed: string;
        hobnobbing: string;
        honied: string;
        hopped: string;
        hopping: string;
        horrified: string;
        hove: string;
        hugged: string;
        hugging: string;
        hummed: string;
        humming: string;
        hung: string;
        hurried: string;
        identified: string;
        impelled: string;
        impelling: string;
        implied: string;
        incurred: string;
        incurring: string;
        indemnified: string;
        inferred: string;
        inferring: string;
        initialled: string;
        initialling: string;
        intensified: string;
        interred: string;
        interring: string;
        interwove: string;
        interwoven: string;
        is: string;
        jagged: string;
        jagging: string;
        jammed: string;
        jamming: string;
        jetted: string;
        jetting: string;
        jimmied: string;
        jogged: string;
        jogging: string;
        justified: string;
        kept: string;
        kidded: string;
        kidding: string;
        kidnapped: string;
        kidnapping: string;
        knelt: string;
        knew: string;
        knitted: string;
        knitting: string;
        knotted: string;
        knotting: string;
        known: string;
        labelled: string;
        labelling: string;
        laden: string;
        lagged: string;
        lagging: string;
        laid: string;
        lain: string;
        lay: string;
        leant: string;
        leapfrogged: string;
        leapfrogging: string;
        leapt: string;
        learnt: string;
        led: string;
        left: string;
        lent: string;
        letting: string;
        levelled: string;
        levelling: string;
        levied: string;
        libelled: string;
        libelling: string;
        liquefied: string;
        lit: string;
        lobbed: string;
        lobbied: string;
        lobbing: string;
        logged: string;
        logging: string;
        lost: string;
        lugged: string;
        lugging: string;
        lying: string;
        made: string;
        magnified: string;
        manned: string;
        manning: string;
        mapped: string;
        mapping: string;
        marred: string;
        married: string;
        marring: string;
        marshalled: string;
        marshalling: string;
        marvelled: string;
        marvelling: string;
        meant: string;
        met: string;
        mimicked: string;
        mimicking: string;
        misapplied: string;
        misled: string;
        misspelt: string;
        mistaken: string;
        mistook: string;
        misunderstood: string;
        modelled: string;
        modelling: string;
        modified: string;
        mollified: string;
        molten: string;
        mopped: string;
        mopping: string;
        mown: string;
        multiplied: string;
        mummified: string;
        mystified: string;
        nabbed: string;
        nabbing: string;
        nagged: string;
        nagging: string;
        napped: string;
        napping: string;
        netted: string;
        netting: string;
        nipped: string;
        nipping: string;
        nodded: string;
        nodding: string;
        notified: string;
        nullified: string;
        occupied: string;
        occurred: string;
        occurring: string;
        offsetting: string;
        omitted: string;
        omitting: string;
        ossified: string;
        outbidden: string;
        outbidding: string;
        outdid: string;
        outdone: string;
        outfitted: string;
        outfitting: string;
        outgrew: string;
        outgrown: string;
        outputted: string;
        outputting: string;
        outran: string;
        outrunning: string;
        outshone: string;
        outsold: string;
        outstripped: string;
        outstripping: string;
        outwitted: string;
        outwitting: string;
        overcame: string;
        overdid: string;
        overdone: string;
        overdrawn: string;
        overdrew: string;
        overflown: string;
        overheard: string;
        overhung: string;
        overlaid: string;
        overlapped: string;
        overlapping: string;
        overpaid: string;
        overridden: string;
        overrode: string;
        oversaw: string;
        overseen: string;
        oversimplified: string;
        overspent: string;
        overstepped: string;
        overstepping: string;
        overtaken: string;
        overthrew: string;
        overthrown: string;
        overtook: string;
        pacified: string;
        padded: string;
        padding: string;
        paid: string;
        panicked: string;
        panicking: string;
        panned: string;
        panning: string;
        parallelled: string;
        parallelling: string;
        parcelled: string;
        parcelling: string;
        parodied: string;
        parried: string;
        partaken: string;
        partook: string;
        patrolled: string;
        patrolling: string;
        patted: string;
        patting: string;
        pedalled: string;
        pedalling: string;
        pegged: string;
        pegging: string;
        pencilled: string;
        pencilling: string;
        penned: string;
        penning: string;
        pent: string;
        permitted: string;
        permitting: string;
        personified: string;
        petrified: string;
        petted: string;
        petting: string;
        photocopied: string;
        pilloried: string;
        pinned: string;
        pinning: string;
        pitied: string;
        pitted: string;
        pitting: string;
        planned: string;
        planning: string;
        pled: string;
        plied: string;
        plodded: string;
        plodding: string;
        plopped: string;
        plopping: string;
        plotted: string;
        plotting: string;
        plugged: string;
        plugging: string;
        popped: string;
        popping: string;
        potted: string;
        potting: string;
        preferred: string;
        preferring: string;
        preoccupied: string;
        prepaid: string;
        pried: string;
        prodded: string;
        prodding: string;
        programmed: string;
        programmes: string;
        programming: string;
        propelled: string;
        propelling: string;
        prophesied: string;
        propped: string;
        propping: string;
        proven: string;
        pummelled: string;
        pummelling: string;
        purified: string;
        putting: string;
        qualified: string;
        quantified: string;
        quarrelled: string;
        quarrelling: string;
        quitted: string;
        quitting: string;
        quizzed: string;
        quizzes: string;
        quizzing: string;
        rallied: string;
        rammed: string;
        ramming: string;
        ran: string;
        rang: string;
        rapped: string;
        rapping: string;
        rarefied: string;
        ratified: string;
        ratted: string;
        ratting: string;
        rebelled: string;
        rebelling: string;
        rebuilt: string;
        rebutted: string;
        rebutting: string;
        reclassified: string;
        rectified: string;
        recurred: string;
        recurring: string;
        redid: string;
        redone: string;
        referred: string;
        referring: string;
        refitted: string;
        refitting: string;
        refuelled: string;
        refuelling: string;
        regretted: string;
        regretting: string;
        reheard: string;
        relied: string;
        remade: string;
        remarried: string;
        remitted: string;
        remitting: string;
        repaid: string;
        repelled: string;
        repelling: string;
        replied: string;
        resetting: string;
        retaken: string;
        rethought: string;
        retook: string;
        retried: string;
        retrofitted: string;
        retrofitting: string;
        revelled: string;
        revelling: string;
        revved: string;
        revving: string;
        rewritten: string;
        rewrote: string;
        ricochetted: string;
        ricochetting: string;
        ridded: string;
        ridden: string;
        ridding: string;
        rigged: string;
        rigging: string;
        ripped: string;
        ripping: string;
        risen: string;
        rivalled: string;
        rivalling: string;
        resold: string;
        robbed: string;
        robbing: string;
        rode: string;
        rose: string;
        rotted: string;
        rotting: string;
        rubbed: string;
        rubbing: string;
        rung: string;
        running: string;
        sagged: string;
        sagging: string;
        said: string;
        sallied: string;
        sang: string;
        sank: string;
        sapped: string;
        sapping: string;
        sat: string;
        satisfied: string;
        savvied: string;
        saw: string;
        scanned: string;
        scanning: string;
        scrapped: string;
        scrapping: string;
        scrubbed: string;
        scrubbing: string;
        scurried: string;
        seed: string;
        seen: string;
        sent: string;
        setting: string;
        sewn: string;
        shaken: string;
        shaven: string;
        shed: string;
        shedding: string;
        shied: string;
        shimmed: string;
        shimmied: string;
        shimming: string;
        shipped: string;
        shipping: string;
        shone: string;
        shook: string;
        shopped: string;
        shopping: string;
        shot: string;
        shovelled: string;
        shovelling: string;
        shown: string;
        shrank: string;
        shredded: string;
        shredding: string;
        shrivelled: string;
        shrivelling: string;
        shrugged: string;
        shrugging: string;
        shrunk: string;
        shrunken: string;
        shunned: string;
        shunning: string;
        shutting: string;
        sicked: string;
        sicking: string;
        sidestepped: string;
        sidestepping: string;
        signalled: string;
        signalling: string;
        signified: string;
        simplified: string;
        singing: string;
        sinned: string;
        sinning: string;
        sitting: string;
        "ski'd": string;
        skidded: string;
        skidding: string;
        skimmed: string;
        skimming: string;
        skipped: string;
        skipping: string;
        slain: string;
        slammed: string;
        slamming: string;
        slapped: string;
        slapping: string;
        sledding: string;
        slept: string;
        slew: string;
        slid: string;
        slidden: string;
        slipped: string;
        slipping: string;
        slitting: string;
        slogged: string;
        slogging: string;
        slopped: string;
        slopping: string;
        slugged: string;
        slugging: string;
        slung: string;
        slurred: string;
        slurring: string;
        smelt: string;
        snagged: string;
        snagging: string;
        snapped: string;
        snapping: string;
        snipped: string;
        snipping: string;
        snubbed: string;
        snubbing: string;
        snuck: string;
        sobbed: string;
        sobbing: string;
        sold: string;
        solidified: string;
        sought: string;
        sown: string;
        spanned: string;
        spanning: string;
        spat: string;
        specified: string;
        sped: string;
        spelt: string;
        spent: string;
        spied: string;
        spilt: string;
        spinning: string;
        spiralled: string;
        spiralling: string;
        spitted: string;
        spitting: string;
        splitting: string;
        spoilt: string;
        spoke: string;
        spoken: string;
        spotlit: string;
        spotted: string;
        spotting: string;
        sprang: string;
        sprung: string;
        spun: string;
        spurred: string;
        spurring: string;
        squatted: string;
        squatting: string;
        stank: string;
        starred: string;
        starring: string;
        stemmed: string;
        stemming: string;
        stepped: string;
        stepping: string;
        stirred: string;
        stirring: string;
        stole: string;
        stolen: string;
        stood: string;
        stopped: string;
        stopping: string;
        stove: string;
        strapped: string;
        strapping: string;
        stratified: string;
        stridden: string;
        stripped: string;
        stripping: string;
        striven: string;
        strode: string;
        strove: string;
        struck: string;
        strung: string;
        stubbed: string;
        stubbing: string;
        stuck: string;
        studied: string;
        stung: string;
        stunk: string;
        stunned: string;
        stunning: string;
        stymying: string;
        subletting: string;
        submitted: string;
        submitting: string;
        summed: string;
        summing: string;
        sung: string;
        sunk: string;
        sunken: string;
        sunned: string;
        sunning: string;
        supplied: string;
        swabbed: string;
        swabbing: string;
        swam: string;
        swapped: string;
        swapping: string;
        swept: string;
        swimming: string;
        swivelled: string;
        swivelling: string;
        swollen: string;
        swopped: string;
        swopping: string;
        swops: string;
        swore: string;
        sworn: string;
        swum: string;
        swung: string;
        tagged: string;
        tagging: string;
        taken: string;
        tallied: string;
        tapped: string;
        tapping: string;
        tarried: string;
        taught: string;
        taxying: string;
        terrified: string;
        testified: string;
        thinned: string;
        thinning: string;
        thought: string;
        threw: string;
        thriven: string;
        throbbed: string;
        throbbing: string;
        throve: string;
        thrown: string;
        thudded: string;
        thudding: string;
        tipped: string;
        tipping: string;
        told: string;
        took: string;
        topped: string;
        topping: string;
        tore: string;
        torn: string;
        totalled: string;
        totalling: string;
        trafficked: string;
        trafficking: string;
        trameled: string;
        trameling: string;
        tramelled: string;
        tramelling: string;
        tramels: string;
        transferred: string;
        transferring: string;
        transmitted: string;
        transmitting: string;
        trapped: string;
        trapping: string;
        travelled: string;
        travelling: string;
        trekked: string;
        trekking: string;
        tried: string;
        trimmed: string;
        trimming: string;
        tripped: string;
        tripping: string;
        trod: string;
        trodden: string;
        trotted: string;
        trotting: string;
        tugged: string;
        tugging: string;
        tunnelled: string;
        tunnelling: string;
        tying: string;
        typified: string;
        undercutting: string;
        undergone: string;
        underlain: string;
        underlay: string;
        underlying: string;
        underpinned: string;
        underpinning: string;
        understood: string;
        undertaken: string;
        undertook: string;
        underwent: string;
        underwritten: string;
        underwrote: string;
        undid: string;
        undone: string;
        unified: string;
        unravelled: string;
        unravelling: string;
        unsteadied: string;
        untying: string;
        unwound: string;
        upheld: string;
        upsetting: string;
        varied: string;
        verified: string;
        vilified: string;
        wadded: string;
        wadding: string;
        wagged: string;
        wagging: string;
        was: string;
        wearied: string;
        wedded: string;
        wedding: string;
        weed: string;
        went: string;
        wept: string;
        were: string;
        wetted: string;
        wetting: string;
        whetted: string;
        whetting: string;
        whipped: string;
        whipping: string;
        whizzed: string;
        whizzes: string;
        whizzing: string;
        winning: string;
        withdrawn: string;
        withdrew: string;
        withheld: string;
        withstood: string;
        woke: string;
        woken: string;
        won: string;
        wore: string;
        worn: string;
        worried: string;
        worshipped: string;
        worshipping: string;
        wound: string;
        wove: string;
        woven: string;
        wrapped: string;
        wrapping: string;
        written: string;
        wrote: string;
        wrought: string;
        wrung: string;
        yodelled: string;
        yodelling: string;
        zapped: string;
        zapping: string;
        zigzagged: string;
        zigzagging: string;
        zipped: string;
        zipping: string;
    };
    IRREG_VERBS_NOLEX: {
        abutted: string;
        abutting: string;
        "ad-libbed": string;
        "ad-libbing": string;
        aerified: string;
        "air-dried": string;
        airdropped: string;
        airdropping: string;
        appalled: string;
        appalling: string;
        averred: string;
        averring: string;
        "baby-sat": string;
        "baby-sitting": string;
        "back-pedalled": string;
        "back-pedalling": string;
        backslid: string;
        backslidden: string;
        befogged: string;
        befogging: string;
        begirt: string;
        bejewelled: string;
        bejewelling: string;
        "belly-flopped": string;
        "belly-flopping": string;
        blabbed: string;
        blabbing: string;
        bobbed: string;
        bobbing: string;
        "bogged-down": string;
        bogged_down: string;
        "bogging-down": string;
        bogging_down: string;
        "bogs-down": string;
        bogs_down: string;
        "booby-trapped": string;
        "booby-trapping": string;
        "bottle-fed": string;
        "breast-fed": string;
        brutified: string;
        bullshitted: string;
        bullshitting: string;
        bullwhipped: string;
        bullwhipping: string;
        caddies: string;
        caddying: string;
        carolled: string;
        carolling: string;
        catnapped: string;
        catnapping: string;
        citified: string;
        cleft: string;
        clopped: string;
        clopping: string;
        clove: string;
        cloven: string;
        "co-opted": string;
        "co-opting": string;
        "co-opts": string;
        "co-starred": string;
        "co-starring": string;
        coiffed: string;
        coiffing: string;
        "court-martialled": string;
        "court-martialling": string;
        crossbred: string;
        crosscutting: string;
        curtsied: string;
        dabbed: string;
        dabbing: string;
        dandified: string;
        debarred: string;
        debarring: string;
        debugged: string;
        debugging: string;
        decalcified: string;
        declassified: string;
        decontrolled: string;
        "deep-fried": string;
        dehumidified: string;
        deified: string;
        demystified: string;
        disbarred: string;
        disbarring: string;
        disembodied: string;
        disembowelled: string;
        disembowelling: string;
        disenthralled: string;
        disenthralling: string;
        disenthralls: string;
        disenthrals: string;
        disinterred: string;
        disinterring: string;
        distilled: string;
        distilling: string;
        eddied: string;
        edified: string;
        "ego-tripped": string;
        "ego-tripping": string;
        empanelled: string;
        empanelling: string;
        emulsified: string;
        entrapped: string;
        entrapping: string;
        fibbed: string;
        fibbing: string;
        filled_up: string;
        "flip-flopped": string;
        "flip-flopping": string;
        flogged: string;
        flogging: string;
        foreran: string;
        forerunning: string;
        foxtrotted: string;
        foxtrotting: string;
        "freeze-dried": string;
        frigged: string;
        frigging: string;
        fritted: string;
        fritting: string;
        fulfilled: string;
        fulfilling: string;
        gambolled: string;
        gambolling: string;
        gasified: string;
        gelt: string;
        gets_lost: string;
        gets_started: string;
        getting_lost: string;
        getting_started: string;
        ghostwritten: string;
        ghostwrote: string;
        giftwrapped: string;
        giftwrapping: string;
        gilt: string;
        gipped: string;
        gipping: string;
        glommed: string;
        glomming: string;
        goes_deep: string;
        going_deep: string;
        gone_deep: string;
        "goose-stepped": string;
        "goose-stepping": string;
        got_lost: string;
        got_started: string;
        gotten_lost: string;
        gypped: string;
        gypping: string;
        had_a_feeling: string;
        had_left: string;
        had_the_feeling: string;
        "hand-knitted": string;
        "hand-knitting": string;
        handfed: string;
        has_a_feeling: string;
        has_left: string;
        has_the_feeling: string;
        having_a_feeling: string;
        having_left: string;
        having_the_feeling: string;
        "high-hatted": string;
        "high-hatting": string;
        hogtying: string;
        horsewhipped: string;
        horsewhipping: string;
        humidified: string;
        hypertrophied: string;
        inbred: string;
        installed: string;
        installing: string;
        interbred: string;
        intercutting: string;
        interlaid: string;
        interlapped: string;
        intermarried: string;
        jellified: string;
        jibbed: string;
        jibbing: string;
        jitterbugged: string;
        jitterbugging: string;
        joined_forces: string;
        joining_battle: string;
        joining_forces: string;
        joins_battle: string;
        joins_forces: string;
        "joy-ridden": string;
        "joy-rode": string;
        jumped_off: string;
        jumping_off: string;
        jumps_off: string;
        jutted: string;
        jutting: string;
        knapped: string;
        knapping: string;
        "ko'd": string;
        "ko'ing": string;
        "ko's": string;
        lallygagged: string;
        lallygagging: string;
        leaves_undone: string;
        leaving_undone: string;
        left_undone: string;
        lignified: string;
        liquified: string;
        looked_towards: string;
        looking_towards: string;
        looks_towards: string;
        "machine-gunned": string;
        "machine-gunning": string;
        minified: string;
        miscarried: string;
        misdealt: string;
        misgave: string;
        misgiven: string;
        mislaid: string;
        mispled: string;
        misspent: string;
        mortified: string;
        objectified: string;
        outfought: string;
        outridden: string;
        outrode: string;
        outshot: string;
        outthought: string;
        overbidden: string;
        overbidding: string;
        overblew: string;
        overblown: string;
        overflew: string;
        overgrew: string;
        overgrown: string;
        overshot: string;
        overslept: string;
        overwritten: string;
        overwrote: string;
        "pinch-hitting": string;
        "pistol-whipped": string;
        "pistol-whipping": string;
        played_a_part: string;
        playing_a_part: string;
        plays_a_part: string;
        pommelled: string;
        pommelling: string;
        prettified: string;
        putrefied: string;
        quickstepped: string;
        quickstepping: string;
        rappelled: string;
        rappelling: string;
        recapped: string;
        recapping: string;
        recommitted: string;
        recommitting: string;
        reified: string;
        rent: string;
        repotted: string;
        repotting: string;
        retransmitted: string;
        retransmitting: string;
        reunified: string;
        rewound: string;
        sanctified: string;
        sandbagged: string;
        sandbagging: string;
        scarified: string;
        scatted: string;
        scrammed: string;
        scramming: string;
        scrummed: string;
        scrumming: string;
        shagged: string;
        shagging: string;
        shaken_hands: string;
        shakes_hands: string;
        shaking_hands: string;
        sharecropped: string;
        sharecropping: string;
        shellacked: string;
        shellacking: string;
        shook_hands: string;
        "shrink-wrapped": string;
        "shrink-wrapping": string;
        sideslipped: string;
        sideslipping: string;
        sightsaw: string;
        sightseen: string;
        "skinny-dipped": string;
        "skinny-dipping": string;
        skydove: string;
        slunk: string;
        smit: string;
        smitten: string;
        smote: string;
        snivelled: string;
        snivelling: string;
        snogged: string;
        snogging: string;
        "soft-pedalled": string;
        "soft-pedalling": string;
        sparred: string;
        sparring: string;
        speechified: string;
        spellbound: string;
        "spin-dried": string;
        "spoon-fed": string;
        stems_from: string;
        stencilled: string;
        stencilling: string;
        strewn: string;
        strummed: string;
        strumming: string;
        stultified: string;
        stupefied: string;
        subjectified: string;
        subtotalled: string;
        subtotalling: string;
        sullied: string;
        supped: string;
        supping: string;
        syllabified: string;
        taken_a_side: string;
        taken_pains: string;
        taken_steps: string;
        takes_a_side: string;
        takes_pains: string;
        takes_steps: string;
        taking_a_side: string;
        taking_pains: string;
        taking_steps: string;
        talcked: string;
        talcking: string;
        threw_out: string;
        throwing_out: string;
        thrown_out: string;
        throws_out: string;
        thrummed: string;
        thrumming: string;
        took_a_side: string;
        took_pains: string;
        took_steps: string;
        trammed: string;
        tramming: string;
        transfixt: string;
        transmogrified: string;
        trepanned: string;
        trepanning: string;
        typesetting: string;
        typewritten: string;
        typewrote: string;
        uglified: string;
        unbound: string;
        unclad: string;
        underbidding: string;
        underfed: string;
        underpaid: string;
        undersold: string;
        understudied: string;
        unfroze: string;
        unfrozen: string;
        unlearnt: string;
        unmade: string;
        unmanned: string;
        unmanning: string;
        unpinned: string;
        unpinning: string;
        unplugged: string;
        unplugging: string;
        unslung: string;
        unstrung: string;
        unstuck: string;
        unwrapped: string;
        unwrapping: string;
        unzipped: string;
        unzipping: string;
        uppercutting: string;
        verbified: string;
        versified: string;
        vivified: string;
        vying: string;
        waylaid: string;
        went_deep: string;
        whinnied: string;
        whirred: string;
        whirring: string;
        "window-shopped": string;
        "window-shopping": string;
        yakked: string;
        yakking: string;
        yapped: string;
        yapping: string;
    };
    IRREG_PAST_PART: string[];
    perfect: any;
    progressive: any;
    passive: any;
    interrogative: any;
    tense: any;
    person: any;
    number: any;
    form: any;
    _parseArgs(args: any): void;
    _checkRules(ruleSet: any, theVerb: any): any;
    _doubleFinalConsonant(word: any): any;
    _isPastParticiple(word: any): boolean;
    _pastTense(theVerb: any, pers: any, numb: any): any;
    _presentTense(theVerb: any, person: any, number: any): any;
    _verbForm(theVerb: any, tense: any, person: any, number: any): any;
    _handleStem: (word: any) => any;
}
declare namespace Conjugator {
    export { VERB_CONS_DOUBLING };
}
declare const VERB_CONS_DOUBLING: string[];