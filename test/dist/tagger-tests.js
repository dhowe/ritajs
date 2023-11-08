import { expect } from "chai";
import RiTa from "./index.js";
describe("Tagger", () => {
  let hasLex = true;
  it("Should call pos.array", function() {
    if (!hasLex)
      this.skip();
    expect(RiTa.pos([])).eql([]);
    expect(RiTa.pos(["deal"])).eql(["nn"]);
    expect(RiTa.pos(["freed"])).eql(["jj"]);
    expect(RiTa.pos(["the"])).eql(["dt"]);
    expect(RiTa.pos(["a"])).eql(["dt"]);
    expect(RiTa.pos("the top seed".split(/ /))).eql(["dt", "jj", "nn"]);
    expect(RiTa.pos("by illegal means".split(/ /))).eql(["in", "jj", "nn"]);
    expect(RiTa.pos("He outnumbers us".split(/ /))).eql(["prp", "vbz", "prp"]);
    expect(RiTa.pos("I outnumber you".split(/ /))).eql(["prp", "vbp", "prp"]);
    expect(RiTa.pos("Elephants dance".split(/ /))).eql(["nns", "vbp"]);
    expect(RiTa.pos("the boy dances".split(/ /))).eql(["dt", "nn", "vbz"]);
    expect(RiTa.pos("Dave dances".split(/ /))).eql(["nnp", "vbz"]);
  });
  it("Should call simple pos.array", function() {
    expect(RiTa.pos([], { simple: true })).eql([]);
    expect(RiTa.pos(["freed"], { simple: true })).eql(["a"]);
    expect(RiTa.pos(["the"], { simple: true })).eql(["-"]);
    expect(RiTa.pos(["a"], { simple: true })).eql(["-"]);
    expect(RiTa.pos("the top seed".split(/ /), { simple: true })).eql(["-", "a", "n"]);
    expect(RiTa.pos("by illegal means".split(/ /), { simple: true })).eql(["-", "a", "n"]);
    expect(RiTa.pos("He outnumbers us".split(/ /), { simple: true })).eql(["-", "v", "-"]);
    expect(RiTa.pos("I outnumber you".split(/ /), { simple: true })).eql(["-", "v", "-"]);
    expect(RiTa.pos("Elephants dance".split(/ /), { simple: true })).eql(["n", "v"]);
    expect(RiTa.pos("the boy dances".split(/ /), { simple: true })).eql(["-", "n", "v"]);
  });
  it("Should call pos.array.inline.simple", function() {
    let result, answer, txt;
    expect(RiTa.pos([], { inline: true, simple: true })).eql("");
    expect(RiTa.pos(["asdfaasd"], { inline: true, simple: true })).eql("asdfaasd/n");
    result = RiTa.pos(["clothes"], { inline: true, simple: true });
    answer = "clothes/n";
    expect(result).eql(answer);
    result = RiTa.pos(["teeth"], { inline: true, simple: true });
    answer = "teeth/n";
    expect(result).eql(answer);
    result = RiTa.pos("There is a cat".split(/ /), { inline: true, simple: true });
    answer = "There/- is/v a/- cat/n";
    expect(result).eql(answer);
    result = RiTa.pos(RiTa.tokenize("The boy, dressed in red, ate an apple."), { inline: true, simple: true });
    answer = "The/- boy/n , dressed/v in/- red/a , ate/v an/- apple/n .";
    expect(result).eql(answer);
    txt = "The dog ran faster than the other dog. But the other dog was prettier.";
    result = RiTa.pos(RiTa.tokenize(txt), { inline: true, simple: true });
    answer = "The/- dog/n ran/v faster/r than/- the/- other/a dog/n . But/- the/- other/a dog/n was/v prettier/a .";
    expect(result).eq(answer);
    ;
  });
  it("Should handle inflected verbs", function() {
    expect(RiTa.pos("disbelieves")).eql(["vbz"]);
    expect(RiTa.pos("disbelieves", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("fates")).eql(["nns"]);
    expect(RiTa.pos("fates", { simple: 1 })).eql(["n"]);
    expect(RiTa.pos("hates")).eql(["vbz"]);
    expect(RiTa.pos("hates", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("hated")).eql(["vbd"]);
    expect(RiTa.pos("hated", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("hating")).eql(["vbg"]);
    expect(RiTa.pos("hating", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("He rode the horse")).eql(["prp", "vbd", "dt", "nn"]);
    expect(RiTa.pos("He has ridden the horse")).eql(["prp", "vbz", "vbn", "dt", "nn"]);
    expect(RiTa.pos("He rowed the boat")).eql(["prp", "vbd", "dt", "nn"]);
    expect(RiTa.pos("He has rowed the boat")).eql(["prp", "vbz", "vbn", "dt", "nn"]);
  });
  it("Should call pos", function() {
    let result, answer, resultArr, answerArr, txt;
    expect(RiTa.pos("")).eql([]);
    expect(RiTa.pos(",")).eql([","]);
    expect(RiTa.pos(" ")).eql([]);
    expect(RiTa.pos("freed")).eql(["jj"]);
    expect(RiTa.pos("biped")).eql(["nn"]);
    expect(RiTa.pos("greed")).eql(["nn"]);
    expect(RiTa.pos("creed")).eql(["nn"]);
    expect(RiTa.pos("weed")).eql(["nn"]);
    expect(RiTa.pos("broke")).eql(["vbd"]);
    expect(RiTa.pos("broke", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("committed")).eql(["vbn"]);
    expect(RiTa.pos("committed", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("outpaced")).eql(["vbd"]);
    expect(RiTa.pos("outpaced", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("concerned")).eql(["vbd"]);
    expect(RiTa.pos("concerned", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("committed")).eql(["vbn"]);
    expect(RiTa.pos("committed", { simple: 1 })).eql(["v"]);
    expect(RiTa.pos("the top seed")).eql(["dt", "jj", "nn"]);
    expect(RiTa.pos("by illegal means")).eql(["in", "jj", "nn"]);
    expect(RiTa.pos("Joannie Smith ran away")).eql(["nnp", "nnp", "vbd", "rb"]);
    result = RiTa.pos("mammal");
    answer = ["nn"];
    expect(result).eql(answer);
    result = RiTa.pos("asfaasd");
    answer = ["nn"];
    expect(result).eql(answer);
    result = RiTa.pos("innings");
    answer = ["nns"];
    expect(result).eql(answer);
    result = RiTa.pos("clothes");
    answer = ["nns"];
    expect(result).eql(answer);
    result = RiTa.pos("clothes");
    answer = ["nns"];
    expect(result).eql(answer);
    result = RiTa.pos("teeth");
    answer = ["nns"];
    expect(result).eql(answer);
    result = RiTa.pos("memories");
    answer = ["nns"];
    expect(result).eql(answer);
    expect(RiTa.pos("flunks")).eql(["vbz"], "Failed: flunks");
    expect(RiTa.pos("outnumbers")).eql(["vbz"], "Failed: outnumbers");
    expect(RiTa.pos("He outnumbers us")).eql(["prp", "vbz", "prp"]);
    expect(RiTa.pos("I outnumber you")).eql(["prp", "vbp", "prp"]);
    resultArr = RiTa.pos("Elephants dance");
    answerArr = ["nns", "vbp"];
    expect(answerArr).eql(resultArr);
    result = RiTa.pos("the boy dances");
    answer = ["dt", "nn", "vbz"];
    expect(result).eql(answer);
    result = RiTa.pos("he dances");
    answer = ["prp", "vbz"];
    expect(result).eql(answer);
    resultArr = RiTa.pos("Dave dances");
    answerArr = ["nnp", "vbz"];
    expect(answerArr).eql(resultArr);
    result = RiTa.pos("running");
    answer = ["vbg"];
    expect(result).eql(answer);
    result = RiTa.pos("asserting");
    answer = ["vbg"];
    expect(result).eql(answer);
    result = RiTa.pos("assenting");
    answer = ["vbg"];
    expect(result).eql(answer);
    result = RiTa.pos("Dave");
    answer = ["nnp"];
    expect(result).eql(answer);
    result = RiTa.pos("They feed the cat");
    answer = ["prp", "vbp", "dt", "nn"];
    expect(result).eql(answer);
    result = RiTa.pos("There is a cat.");
    answer = ["ex", "vbz", "dt", "nn", "."];
    expect(result).eql(answer);
    result = RiTa.pos("The boy, dressed in red, ate an apple.");
    answer = ["dt", "nn", ",", "vbn", "in", "jj", ",", "vbd", "dt", "nn", "."];
    expect(result).eql(answer);
    txt = "The dog ran faster than the other dog.  But the other dog was prettier.";
    result = RiTa.pos(txt);
    answer = ["dt", "nn", "vbd", "rbr", "in", "dt", "jj", "nn", ".", "cc", "dt", "jj", "nn", "vbd", "jjr", "."];
    expect(result).eql(answer);
    expect(RiTa.pos("is")).eql(["vbz"]);
    expect(RiTa.pos("am")).eql(["vbp"]);
    expect(RiTa.pos("be")).eql(["vb"]);
    result = RiTa.pos("There is a cat.");
    answer = ["ex", "vbz", "dt", "nn", "."];
    expect(result).eql(answer);
    result = RiTa.pos("There was a cat.");
    answer = ["ex", "vbd", "dt", "nn", "."];
    expect(result).eql(answer);
    result = RiTa.pos("I am a cat.");
    answer = ["prp", "vbp", "dt", "nn", "."];
    expect(result).eql(answer);
    result = RiTa.pos("I was a cat.");
    answer = ["prp", "vbd", "dt", "nn", "."];
    expect(result).eql(answer);
    expect(RiTa.pos("flunk")).eql(["vb"]);
    expect(RiTa.pos("He flunks the test")).eql(["prp", "vbz", "dt", "nn"]);
    expect(RiTa.pos("he")).eql(["prp"]);
    expect(RiTa.pos("outnumber")).eql(["vb"]);
    expect(RiTa.pos("I outnumbered you")).eql(["prp", "vbd", "prp"], "I outnumbered you");
    expect(RiTa.pos("She outnumbered us")).eql(["prp", "vbd", "prp"], "She outnumbered us");
    expect(RiTa.pos("I am outnumbering you")).eql(["prp", "vbp", "vbg", "prp"], "I am outnumbering you");
    expect(RiTa.pos("I have outnumbered you")).eql(["prp", "vbp", "vbd", "prp"], "I have outnumbered you");
    let checks = ["emphasis", "stress", "discus", "colossus", "fibrosis", "digitalis", "pettiness", "mess", "cleanliness", "orderliness", "bronchitis", "preparedness", "highness"];
    for (let i = 0, j = checks.length; i < j; i++) {
      expect(RiTa.pos(checks[i])).eql(["nn"]);
    }
    expect(RiTa.pos("a light blue sky")).eql(["dt", "jj", "jj", "nn"]);
    expect(RiTa.pos("He is running toward me")).eql(["prp", "vbz", "vbg", "in", "prp"]);
    expect(RiTa.pos("She is riding a bike")).eql(["prp", "vbz", "vbg", "dt", "nn"]);
    expect(RiTa.pos("he stands still, thinking about the words")).eql(["prp", "vbz", "rb", ",", "vbg", "in", "dt", "nns"]);
    expect(RiTa.pos("She walked out of the room smoking")).eql(["prp", "vbd", "in", "in", "dt", "nn", "vbg"]);
    expect(RiTa.pos("He kept saying his adventure story")).eql(["prp", "vbd", "vbg", "prp$", "nn", "nn"]);
    expect(RiTa.pos("Drinking is his hobby")).eql(["vbg", "vbz", "prp$", "nn"]);
    expect(RiTa.pos("The kid playing at the corner is the boss")).eql(["dt", "nn", "vbg", "in", "dt", "nn", "vbz", "dt", "nn"]);
    expect(RiTa.pos("She is the leader of the reading group")).eql(["prp", "vbz", "dt", "nn", "in", "dt", "vbg", "nn"]);
    expect(RiTa.pos("I love working")).eql(["prp", "vbp", "vbg"]);
    expect(RiTa.pos("I was thinking about buying a car")).eql(["prp", "vbd", "vbg", "in", "vbg", "dt", "nn"]);
    expect(RiTa.pos("lancer")).eql(["nn"]);
    expect(RiTa.pos("dancer")).eql(["nn"]);
    expect(RiTa.pos("builder")).eql(["nn"]);
    expect(RiTa.pos("programmer")).eql(["nn"]);
    expect(RiTa.pos("mixer")).eql(["nn"]);
    expect(RiTa.pos("He is a dancer")).eql(["prp", "vbz", "dt", "nn"]);
    expect(RiTa.pos("She is a body bulider")).eql(["prp", "vbz", "dt", "nn", "nn"]);
    expect(RiTa.pos("I am a programmer")).eql(["prp", "vbp", "dt", "nn"]);
    expect(RiTa.pos("I have gone alone in there")).eql(["prp", "vbp", "vbn", "rb", "in", "nn"]);
    expect(RiTa.pos("We stopped and went on from there")).eql(["prp", "vbd", "cc", "vbd", "in", "in", "nn"]);
    expect(RiTa.pos("She lives there")).eql(["prp", "vbz", "rb"]);
    expect(RiTa.pos("He was standing there")).eql(["prp", "vbd", "vbg", "rb"]);
    expect(RiTa.pos("There are good reasons to save the world")).eql(["ex", "vbp", "jj", "nns", "to", "vb", "dt", "nn"]);
    expect(RiTa.pos("There is a pig")).eql(["ex", "vbz", "dt", "nn"]);
    expect(RiTa.pos("There isn't a world that is worth saving")).eql(["ex", "vbz", "dt", "nn", "in", "vbz", "jj", "vbg"]);
  });
  it("Should call pos.simple", function() {
    expect(RiTa.pos("biped", { simple: true })).eql(["n"]);
    expect(RiTa.pos("greed", { simple: true })).eql(["n"]);
    expect(RiTa.pos("creed", { simple: true })).eql(["n"]);
    expect(RiTa.pos("weed", { simple: true })).eql(["n"]);
    expect(RiTa.pos("is", { simple: true })).eql(["v"]);
    expect(RiTa.pos("am", { simple: true })).eql(["v"]);
    expect(RiTa.pos("be", { simple: true })).eql(["v"]);
    expect(RiTa.pos("freed", { simple: true })).eql(["a"]);
  });
  it("Should call pos.inline", function() {
    let result, answer, txt;
    expect(RiTa.pos("", { inline: true })).eql("");
    expect(RiTa.pos("asdfaasd", { inline: true })).eql("asdfaasd/nn");
    result = RiTa.pos("clothes", { inline: true });
    answer = "clothes/nns";
    expect(result).eql(answer);
    result = RiTa.pos("teeth", { inline: true });
    answer = "teeth/nns";
    expect(result).eql(answer);
    result = RiTa.pos("There is a cat.", { inline: true });
    answer = "There/ex is/vbz a/dt cat/nn .";
    expect(result).eql(answer);
    result = RiTa.pos("The boy, dressed in red, ate an apple.", { inline: true });
    answer = "The/dt boy/nn , dressed/vbn in/in red/jj , ate/vbd an/dt apple/nn .";
    expect(result).eql(answer);
    txt = "The dog ran faster than the other dog.  But the other dog was prettier.";
    result = RiTa.pos(txt, { inline: true });
    answer = "The/dt dog/nn ran/vbd faster/rbr than/in the/dt other/jj dog/nn . But/cc the/dt other/jj dog/nn was/vbd prettier/jjr .";
    expect(result).eq(answer);
    ;
  });
  it("Should call posInline", function() {
    let result, answer, txt;
    expect(RiTa.posInline("")).eql("");
    expect(RiTa.posInline(" ")).eql("");
    expect(RiTa.posInline("asdfaasd")).eql("asdfaasd/nn");
    result = RiTa.posInline("clothes");
    answer = "clothes/nns";
    expect(result).eql(answer);
    result = RiTa.posInline("teeth");
    answer = "teeth/nns";
    expect(result).eql(answer);
    result = RiTa.posInline("There is a cat.");
    answer = "There/ex is/vbz a/dt cat/nn .";
    expect(result).eql(answer);
    result = RiTa.posInline("The boy, dressed in red, ate an apple.");
    answer = "The/dt boy/nn , dressed/vbn in/in red/jj , ate/vbd an/dt apple/nn .";
    expect(result).eql(answer);
    txt = "The dog ran faster than the other dog.  But the other dog was prettier.";
    result = RiTa.posInline(txt);
    answer = "The/dt dog/nn ran/vbd faster/rbr than/in the/dt other/jj dog/nn . But/cc the/dt other/jj dog/nn was/vbd prettier/jjr .";
    expect(result).eq(answer);
    ;
    txt = "The mosquito bit me.";
    result = RiTa.posInline(txt);
    answer = "The/dt mosquito/nn bit/vbd me/prp .";
    expect(result).eq(answer);
    ;
    txt = "Give the duck a bit of bread.";
    result = RiTa.posInline(txt);
    answer = "Give/vb the/dt duck/nn a/dt bit/nn of/in bread/nn .";
    expect(result).eq(answer);
    ;
    txt = "The show has ended.";
    result = RiTa.posInline(txt);
    answer = "The/dt show/nn has/vbz ended/vbn .";
    expect(result).eq(answer);
    ;
    txt = "She remade this video.";
    result = RiTa.posInline(txt);
    answer = "She/prp remade/vbd this/dt video/nn .";
    expect(result).eq(answer);
    ;
    txt = "They will be remade into something else.";
    result = RiTa.posInline(txt);
    answer = "They/prp will/md be/vb remade/vbn into/in something/nn else/rb .";
    ;
    txt = "She sold her apartment.";
    result = RiTa.posInline(txt);
    answer = "She/prp sold/vbd her/prp$ apartment/nn .";
    ;
    txt = "Her apartment was sold.";
    result = RiTa.posInline(txt);
    answer = "Her/prp$ apartment/nn was/vbd sold/vbn .";
    expect(result).eq(answer);
    ;
    txt = "She resold her apartment.";
    result = RiTa.posInline(txt);
    answer = "She/prp resold/vbd her/prp$ apartment/nn .";
    expect(result).eq(answer);
    ;
    txt = "Her apartment was resold.";
    result = RiTa.posInline(txt);
    answer = "Her/prp$ apartment/nn was/vbd resold/vbn .";
    ;
    txt = "He led a team of crows into battle.";
    result = RiTa.posInline(txt);
    answer = "He/prp led/vbd a/dt team/nn of/in crows/nns into/in battle/nn .";
    expect(result).eq(answer);
    ;
    txt = "He led a team of crows into battle.";
    result = RiTa.posInline(txt);
    answer = "He/prp led/vbd a/dt team/nn of/in crows/nns into/in battle/nn .";
    expect(result).eq(answer);
    ;
  });
  it("Should call pos.inline.simple", function() {
    let result, answer, txt;
    expect(RiTa.pos("", { inline: true, simple: true })).eql("");
    expect(RiTa.pos("asdfaasd", { inline: true, simple: true })).eql("asdfaasd/n");
    result = RiTa.pos("clothes", { inline: true, simple: true });
    answer = "clothes/n";
    expect(result).eql(answer);
    result = RiTa.pos("teeth", { inline: true, simple: true });
    answer = "teeth/n";
    expect(result).eql(answer);
    result = RiTa.pos("There is a cat.", { inline: true, simple: true });
    answer = "There/- is/v a/- cat/n .";
    expect(result).eql(answer);
    result = RiTa.pos("The boy, dressed in red, ate an apple.", { inline: true, simple: true });
    answer = "The/- boy/n , dressed/v in/- red/a , ate/v an/- apple/n .";
    expect(result).eql(answer);
    txt = "The dog ran faster than the other dog.  But the other dog was prettier.";
    result = RiTa.pos(txt, { inline: true, simple: true });
    answer = "The/- dog/n ran/v faster/r than/- the/- other/a dog/n . But/- the/- other/a dog/n was/v prettier/a .";
    expect(result).eq(answer);
    ;
  });
  it("Should call posInline.simple", function() {
    let result, answer, txt;
    expect(RiTa.posInline("asdfaasd", { inline: true, simple: true })).eql("asdfaasd/n");
    expect(RiTa.posInline("", { inline: true, simple: true })).eql("");
    result = RiTa.posInline("clothes", { inline: true, simple: true });
    answer = "clothes/n";
    expect(result).eql(answer);
    result = RiTa.posInline("teeth", { inline: true, simple: true });
    answer = "teeth/n";
    expect(result).eql(answer);
    result = RiTa.posInline("There is a cat.", { inline: true, simple: true });
    answer = "There/- is/v a/- cat/n .";
    expect(result).eql(answer);
    result = RiTa.posInline("The boy, dressed in red, ate an apple.", { inline: true, simple: true });
    answer = "The/- boy/n , dressed/v in/- red/a , ate/v an/- apple/n .";
    expect(result).eql(answer);
    txt = "The dog ran faster than the other dog.  But the other dog was prettier.";
    result = RiTa.posInline(txt, { inline: true, simple: true });
    answer = "The/- dog/n ran/v faster/r than/- the/- other/a dog/n . But/- the/- other/a dog/n was/v prettier/a .";
    expect(result).eq(answer);
    ;
  });
  it("Should call isAdverb", function() {
    expect(!RiTa.isAdverb("")).true;
    expect(!RiTa.isAdverb()).true;
    expect(!RiTa.isAdverb(42)).true;
    expect(!RiTa.isAdverb(["lively"])).true;
    expect(!RiTa.isAdverb("swim")).true;
    expect(!RiTa.isAdverb("walk")).true;
    expect(!RiTa.isAdverb("walker")).true;
    expect(!RiTa.isAdverb("beautiful")).true;
    expect(!RiTa.isAdverb("dance")).true;
    expect(!RiTa.isAdverb("dancing")).true;
    expect(!RiTa.isAdverb("dancer")).true;
    expect(!RiTa.isAdverb("wash")).true;
    expect(!RiTa.isAdverb("walk")).true;
    expect(!RiTa.isAdverb("play")).true;
    expect(!RiTa.isAdverb("throw")).true;
    expect(!RiTa.isAdverb("drink")).true;
    expect(!RiTa.isAdverb("eat")).true;
    expect(!RiTa.isAdverb("chew")).true;
    expect(!RiTa.isAdverb("wet")).true;
    expect(!RiTa.isAdverb("dry")).true;
    expect(!RiTa.isAdverb("furry")).true;
    expect(!RiTa.isAdverb("sad")).true;
    expect(!RiTa.isAdverb("happy")).true;
    expect(!RiTa.isAdverb("dogs")).true;
    expect(!RiTa.isAdverb("wind")).true;
    expect(!RiTa.isAdverb("dolls")).true;
    expect(!RiTa.isAdverb("frogs")).true;
    expect(!RiTa.isAdverb("ducks")).true;
    expect(!RiTa.isAdverb("flowers")).true;
    expect(!RiTa.isAdverb("fish")).true;
    expect(RiTa.isAdverb("truthfully")).true;
    expect(RiTa.isAdverb("kindly")).true;
    expect(RiTa.isAdverb("bravely")).true;
    expect(RiTa.isAdverb("doggedly")).true;
    expect(RiTa.isAdverb("sleepily")).true;
    expect(RiTa.isAdverb("scarily")).true;
    expect(RiTa.isAdverb("excitedly")).true;
    expect(RiTa.isAdverb("energetically")).true;
    expect(RiTa.isAdverb("hard")).true;
  });
  it("Should call isNoun", function() {
    expect(RiTa.isNoun("thieves"), "thieves").true;
    expect(RiTa.isNoun("calves")).true;
    expect(!RiTa.isNoun("scarily")).true;
    expect(RiTa.isNoun("boxes")).true;
    expect(RiTa.isNoun("swim")).true;
    expect(RiTa.isNoun("walk")).true;
    expect(RiTa.isNoun("walker")).true;
    expect(RiTa.isNoun("dance")).true;
    expect(RiTa.isNoun("dancer")).true;
    expect(RiTa.isNoun("cats")).true;
    expect(RiTa.isNoun("teeth")).true;
    expect(RiTa.isNoun("apples")).true;
    expect(RiTa.isNoun("buses")).true;
    expect(RiTa.isNoun("prognoses")).true;
    expect(RiTa.isNoun("oxen")).true;
    expect(RiTa.isNoun("theses")).true;
    expect(RiTa.isNoun("stimuli")).true;
    expect(RiTa.isNoun("crises")).true;
    expect(RiTa.isNoun("wash")).true;
    expect(RiTa.isNoun("walk")).true;
    expect(RiTa.isNoun("play")).true;
    expect(RiTa.isNoun("throw")).true;
    expect(RiTa.isNoun("duck")).true;
    expect(RiTa.isNoun("dog")).true;
    expect(RiTa.isNoun("drink")).true;
    expect(!RiTa.isNoun("abates")).true;
    expect(!RiTa.isNoun("eat")).true;
    expect(!RiTa.isNoun("chew")).true;
    expect(!RiTa.isNoun("moved")).true;
    expect(!RiTa.isNoun("went")).true;
    expect(!RiTa.isNoun("spent")).true;
    expect(!RiTa.isNoun("hard")).true;
    expect(!RiTa.isNoun("dry")).true;
    expect(!RiTa.isNoun("furry")).true;
    expect(!RiTa.isNoun("sad")).true;
    expect(!RiTa.isNoun("happy")).true;
    expect(!RiTa.isNoun("beautiful")).true;
    expect(RiTa.isNoun("dogs")).true;
    expect(RiTa.isNoun("wind")).true;
    expect(RiTa.isNoun("dolls")).true;
    expect(RiTa.isNoun("frogs")).true;
    expect(RiTa.isNoun("ducks")).true;
    expect(RiTa.isNoun("flower")).true;
    expect(RiTa.isNoun("fish")).true;
    expect(RiTa.isNoun("wet")).true;
    expect(RiTa.isNoun("ducks")).true;
    expect(RiTa.isNoun("flowers")).true;
    expect(!RiTa.isNoun("truthfully")).true;
    expect(!RiTa.isNoun("kindly")).true;
    expect(!RiTa.isNoun("bravely")).true;
    expect(!RiTa.isNoun("scarily")).true;
    expect(!RiTa.isNoun("sleepily")).true;
    expect(!RiTa.isNoun("excitedly")).true;
    expect(!RiTa.isNoun("energetically")).true;
    expect(!RiTa.isNoun("")).true;
    expect(!RiTa.isNoun()).true;
    expect(!RiTa.isNoun(42)).true;
    expect(!RiTa.isNoun(["rabbit"])).true;
    expect(!RiTa.isNoun("heard"), "heard: " + RiTa.tagger.allTags("heard")).true;
    expect(!RiTa.isNoun("deterred")).true;
  });
  it("Should call isVerb", function() {
    expect(RiTa.isVerb("abandons")).eq(true);
    expect(RiTa.isVerb("dance")).true;
    expect(RiTa.isVerb("swim")).true;
    expect(RiTa.isVerb("walk")).true;
    expect(RiTa.isVerb("dances")).true;
    expect(RiTa.isVerb("swims")).true;
    expect(RiTa.isVerb("walks")).true;
    expect(RiTa.isVerb("costs")).true;
    expect(RiTa.isVerb("danced")).true;
    expect(RiTa.isVerb("swam")).true;
    expect(RiTa.isVerb("walked")).true;
    expect(RiTa.isVerb("costed")).true;
    expect(RiTa.isVerb("satisfies")).true;
    expect(RiTa.isVerb("falsifies")).true;
    expect(RiTa.isVerb("beautifies")).true;
    expect(RiTa.isVerb("repossesses")).true;
    expect(!RiTa.isVerb("dancer")).true;
    expect(!RiTa.isVerb("walker")).true;
    expect(!RiTa.isVerb("beautiful")).true;
    expect(RiTa.isVerb("eat"), "eat").true;
    expect(RiTa.isVerb("chew")).true;
    expect(RiTa.isVerb("throw")).true;
    expect(RiTa.isVerb("walk")).true;
    expect(RiTa.isVerb("wash")).true;
    expect(RiTa.isVerb("drink")).true;
    expect(RiTa.isVerb("fish")).true;
    expect(RiTa.isVerb("wind")).true;
    expect(RiTa.isVerb("wet")).true;
    expect(RiTa.isVerb("dry")).true;
    expect(!RiTa.isVerb("hard")).true;
    expect(!RiTa.isVerb("furry")).true;
    expect(!RiTa.isVerb("sad")).true;
    expect(!RiTa.isVerb("happy")).true;
    expect(!RiTa.isVerb("dolls")).true;
    expect(!RiTa.isVerb("frogs")).true;
    expect(RiTa.isVerb("flowers")).true;
    expect(RiTa.isVerb("ducks")).true;
    expect(!RiTa.isVerb("truthfully")).true;
    expect(!RiTa.isVerb("kindly")).true;
    expect(!RiTa.isVerb("bravely")).true;
    expect(!RiTa.isVerb("scarily")).true;
    expect(!RiTa.isVerb("sleepily")).true;
    expect(!RiTa.isVerb("excitedly")).true;
    expect(!RiTa.isVerb("energetically")).true;
    expect(RiTa.isVerb("hates")).true;
    expect(RiTa.isVerb("hated")).true;
    expect(RiTa.isVerb("hating")).true;
    expect(RiTa.isVerb("dancing")).true;
    expect(RiTa.isVerb("flowers")).true;
    expect(RiTa.isVerb("hates")).true;
    expect(RiTa.isVerb("hated")).true;
    expect(RiTa.isVerb("ridden")).true;
    expect(RiTa.isVerb("rode")).true;
    expect(RiTa.isVerb("abetted")).true;
    expect(RiTa.isVerb("abetting")).true;
    expect(RiTa.isVerb("abutted")).true;
    expect(RiTa.isVerb("abutting")).true;
    expect(RiTa.isVerb("abuts")).true;
    expect(RiTa.isVerb("abut")).true;
    expect(RiTa.isVerb("misdeal")).true;
    expect(RiTa.isVerb("misdeals")).true;
    expect(RiTa.isVerb("misdealt")).true;
    expect(!RiTa.isVerb("")).true;
    expect(!RiTa.isVerb()).true;
    expect(!RiTa.isVerb(42)).true;
    expect(!RiTa.isVerb(["work"])).true;
  });
  it("Should call isAdjective", function() {
    expect(!RiTa.isAdjective("swim")).true;
    expect(!RiTa.isAdjective("walk")).true;
    expect(!RiTa.isAdjective("walker")).true;
    expect(RiTa.isAdjective("beautiful")).true;
    expect(!RiTa.isAdjective("dance")).true;
    expect(!RiTa.isAdjective("dancing")).true;
    expect(!RiTa.isAdjective("dancer")).true;
    expect(!RiTa.isAdjective("wash")).true;
    expect(!RiTa.isAdjective("walk")).true;
    expect(!RiTa.isAdjective("play")).true;
    expect(!RiTa.isAdjective("throw")).true;
    expect(!RiTa.isAdjective("drink")).true;
    expect(!RiTa.isAdjective("eat")).true;
    expect(!RiTa.isAdjective("chew")).true;
    expect(RiTa.isAdjective("hard")).true;
    expect(RiTa.isAdjective("wet")).true;
    expect(RiTa.isAdjective("dry")).true;
    expect(RiTa.isAdjective("furry")).true;
    expect(RiTa.isAdjective("sad")).true;
    expect(RiTa.isAdjective("happy")).true;
    expect(RiTa.isAdjective("kindly")).true;
    expect(!RiTa.isAdjective("dogs")).true;
    expect(!RiTa.isAdjective("wind")).true;
    expect(!RiTa.isAdjective("dolls")).true;
    expect(!RiTa.isAdjective("frogs")).true;
    expect(!RiTa.isAdjective("ducks")).true;
    expect(!RiTa.isAdjective("flowers")).true;
    expect(!RiTa.isAdjective("fish")).true;
    expect(!RiTa.isAdjective("truthfully")).true;
    expect(!RiTa.isAdjective("bravely")).true;
    expect(!RiTa.isAdjective("scarily")).true;
    expect(!RiTa.isAdjective("sleepily")).true;
    expect(!RiTa.isAdjective("excitedly")).true;
    expect(!RiTa.isAdjective("energetically")).true;
    expect(!RiTa.isAdjective("")).true;
    expect(!RiTa.isAdjective()).true;
    expect(!RiTa.isAdjective(42)).true;
    expect(!RiTa.isAdjective(["happy"])).true;
  });
  it("Should call allTags", function() {
    expect(RiTa.tagger.allTags("monkey")).eql(["nn"]);
    expect(RiTa.tagger.allTags("monkeys")).eql(["nns"]);
    expect(RiTa.tagger.allTags("")).eql([]);
    expect(RiTa.tagger.allTags(["monkey"])).eql([]);
    expect(RiTa.tagger.allTags("hates", { noDerivations: true })).eql([]);
    expect(RiTa.tagger.allTags("satisfies")).eql(["vbz"]);
    expect(RiTa.tagger.allTags("falsifies")).eql(["vbz"]);
    expect(RiTa.tagger.allTags("hates")).to.include("vbz");
    expect(RiTa.tagger.allTags("hates")).to.include("nns");
    expect(RiTa.tagger.allTags("cakes")).to.include("nns");
    expect(RiTa.tagger.allTags("repossesses")).to.include("vbz");
    expect(RiTa.tagger.allTags("thieves")).to.include("nns");
    expect(RiTa.tagger.allTags("thieves")).to.include("vbz");
    expect(RiTa.tagger.allTags("hated")).to.include("vbd");
    expect(RiTa.tagger.allTags("hated")).to.include("vbn");
    expect(RiTa.tagger.allTags("owed")).to.include("vbd");
    expect(RiTa.tagger.allTags("owed")).to.include("vbn");
    expect(RiTa.tagger.allTags("assenting")).to.include("vbg");
    expect(RiTa.tagger.allTags("hating")).to.include("vbg");
    expect(RiTa.tagger.allTags("feet")).to.include("nns");
    expect(RiTa.tagger.allTags("men")).to.include("nns");
    expect(RiTa.tagger.allTags("ashdj")).to.include("nn");
    expect(RiTa.tagger.allTags("kahsdly")).to.include("rb");
    expect(RiTa.tagger.allTags("asdkasws")).to.include("nns");
    expect(RiTa.tagger.allTags("bit")).eql(["vbd", "nn", "rb"]);
    expect(RiTa.tagger.allTags("broke")).eql(["vbd", "jj", "rb"]);
    expect(RiTa.tagger.allTags("called")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("committed")).eql(["vbn", "jj", "vbd"]);
    expect(RiTa.tagger.allTags("computerized")).eql(["jj", "vbd", "vbn"]);
    expect(RiTa.tagger.allTags("concerned")).eql(["vbd", "jj", "vbn"]);
    ;
    expect(RiTa.tagger.allTags("discriminated")).eql(["vbd", "vbn", "jj"]);
    expect(RiTa.tagger.allTags("ended")).eql(["vbd", "jj", "vbn"]);
    expect(RiTa.tagger.allTags("expected")).eql(["vbn", "vbd", "jj"]);
    expect(RiTa.tagger.allTags("finished")).eql(["vbd", "jj", "vbn"]);
    expect(RiTa.tagger.allTags("gained")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("got")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("increased")).eql(["vbn", "jj", "vbd"]);
    expect(RiTa.tagger.allTags("involved")).eql(["vbn", "vbd", "jj"]);
    expect(RiTa.tagger.allTags("launched")).eql(["vbn", "vbd"]);
    expect(RiTa.tagger.allTags("led")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("lived")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("oversaw")).eql(["vbd"]);
    expect(RiTa.tagger.allTags("paled")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("prepaid")).eql(["jj", "vbd", "vbn"]);
    ;
    expect(RiTa.tagger.allTags("pressured")).eql(["vbn", "jj", "vbd"]);
    expect(RiTa.tagger.allTags("proliferated")).eql(["vbn", "vbd"]);
    expect(RiTa.tagger.allTags("remade")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("reopened")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("reported")).eql(["vbd", "jj", "vbn"]);
    expect(RiTa.tagger.allTags("resold")).eql(["vbd", "vbn"]);
    expect(RiTa.tagger.allTags("settled")).eql(["vbd", "vbn", "jj"]);
    expect(RiTa.tagger.allTags("started")).eql(["vbd", "jj", "vbn"]);
  });
  it("Should call hasTag", function() {
    expect(!RiTa.tagger.hasTag()).true;
    expect(!RiTa.tagger.hasTag("nn adj", "nn")).true;
    expect(RiTa.tagger.hasTag(RiTa.tagger.allTags("monkey"), "nn")).true;
  });
  it("Should call inlineTags", function() {
    expect(RiTa.tagger.inlineTags()).eq("");
    expect(RiTa.tagger.inlineTags([])).eq("");
    expect(function() {
      RiTa.tagger.inlineTags(["I", "am", "Pikachu"], [], "/");
    }).to.throw();
    expect(RiTa.tagger.inlineTags(["I", "am", "happy", "."], ["prp", "vbp", "jj", "."])).eq("I/prp am/vbp happy/jj .");
    expect(RiTa.tagger.inlineTags(["I", "am", "happy", "."], ["prp", "vbp", "jj", "."], ";")).eq("I;prp am;vbp happy;jj .");
  });
  it("Should call tag", function() {
    expect(RiTa.tagger.tag([])).eql([]);
    expect(RiTa.tagger.tag()).eql([]);
    expect(RiTa.tagger.tag([], { inline: true })).eq("");
    expect(RiTa.tagger.tag(["I", "am", "happy", "."], { simple: true })).eql(["-", "v", "a", "-"]);
    expect(RiTa.tagger.tag(["I", "am", "happy", "."], { simple: true, inline: true })).eq("I/- am/v happy/a .");
    expect(RiTa.tagger.tag(["I", "roll", "a", "9", "."], { inline: true })).eq("I/prp roll/vbp a/dt 9/cd .");
    expect(RiTa.tagger.tag(["A", "badguy", "."], { inline: true })).eq("A/dt badguy/nn .");
    expect(RiTa.tagger.tag(["A", "C", "level", "grade", "."], { inline: true })).eq("A/dt C/C level/jj grade/nn .");
    expect(RiTa.tagger.tag(["The", "run", "was", "great", "."], { inline: true })).eq("The/dt run/nn was/vbd great/jj .");
    expect(RiTa.tagger.tag(["They", "are", "the", "beaten", "."], { inline: true })).eq("They/prp are/vbp the/dt beaten/nn .");
    expect(RiTa.tagger.tag(["A", "diss", "."], { inline: true })).eq("A/dt diss/nns .");
    expect(RiTa.tagger.tag(["The", "soon", "."], { inline: true })).eq("The/dt soon/jj .");
    expect(RiTa.tagger.tag(["The", "sooner", "."], { inline: true })).eq("The/dt sooner/jjr .");
    expect(RiTa.tagger.tag(["The", "soonest", "."], { inline: true })).eq("The/dt soonest/jjs .");
    expect(RiTa.tagger.tag(["It", "is", "59876", "."], { inline: true })).eq("It/prp is/vbz 59876/cd .");
    expect(RiTa.tagger.tag(["I", "teabaged", "."], { inline: true })).eq("I/prp teabaged/vbn .");
    expect(RiTa.tagger.tag(["Sun", "teabaged", "."], { inline: true })).eq("Sun/nn teabaged/vbn .");
    expect(RiTa.tagger.tag(["The", "worker", "proletarianized", "."], { inline: true })).eq("The/dt worker/nn proletarianized/vbn .");
    expect(RiTa.tagger.tag(["The", "fortunately", "."], { inline: true })).eq("The/dt fortunately/rb .");
    expect(RiTa.tagger.tag(["He", "is", "goodly", "working", "."], { inline: true })).eq("He/prp is/vbz goodly/rb working/vbg .");
    expect(RiTa.tagger.tag(["It", "is", "nonexistional", "."], { inline: true })).eq("It/prp is/vbz nonexistional/jj .");
    expect(RiTa.tagger.tag(["It", "is", "mammal", "."], { inline: true })).eq("It/prp is/vbz mammal/nn .");
    expect(RiTa.tagger.tag(["It", "is", "onal", "."], { inline: true })).eq("It/prp is/vbz onal/nn .");
    expect(RiTa.tagger.tag(["We", "must", "place", "it", "."], { inline: true })).eq("We/prp must/md place/vb it/prp .");
    expect(RiTa.tagger.tag(["We", "must", "teabag", "him", "."], { inline: true })).eq("We/prp must/md teabag/vb him/prp .");
    expect(RiTa.tagger.tag(["He", "has", "played", "it", "."], { inline: true })).eq("He/prp has/vbz played/vbn it/prp .");
    expect(RiTa.tagger.tag(["He", "gets", "played", "."], { inline: true })).eq("He/prp gets/vbz played/vbn .");
    expect(RiTa.tagger.tag(["The", "morning", "."], { inline: true })).eq("The/dt morning/nn .");
    expect(RiTa.tagger.tag(["They", "are", "fishing", "."], { inline: true })).eq("They/prp are/vbp fishing/vbg .");
    expect(RiTa.tagger.tag(["He", "dances", "."], { inline: true })).eq("He/prp dances/vbz .");
    expect(RiTa.tagger.tag(["The", "dog", "dances", "."], { inline: true })).eq("The/dt dog/nn dances/vbz .");
    expect(RiTa.tagger.tag(["Dave", "dances", "."], { inline: true })).eq("Dave/nnp dances/vbz .");
    expect(RiTa.tagger.tag(["Taipei", "."], { inline: true })).eq("Taipei/nnp .");
    expect(RiTa.tagger.tag(["Buddhas", "."], { inline: true })).eq("Buddhas/nnps .");
    expect(RiTa.tagger.tag(["In", "Beijing", "."], { inline: true })).eq("In/in Beijing/nnp .");
    expect(RiTa.tagger.tag(["One", "of", "the", "Beats", "."], { inline: true })).eq("One/cd of/in the/dt Beats/nnps .");
    expect(RiTa.tagger.tag(["Taipei", "is", "a", "big", "city", "."], { inline: true })).eq("Taipei/nnp is/vbz a/dt big/jj city/nn .");
    expect(RiTa.tagger.tag(["Buddhas", "in", "this", "temple", "have", "a", "history", "of", "500", "years", "."], { inline: true })).eq("Buddhas/nnps in/in this/dt temple/nn have/vbp a/dt history/nn of/in 500/cd years/nns .");
    expect(RiTa.tagger.tag(["Balls", "on", "the", "floor", "."], { inline: true })).eq("Balls/nns on/in the/dt floor/nn .");
    expect(RiTa.tagger.tag(["dances", "."], { inline: true })).eq("dances/nns .");
    expect(RiTa.tagger.tag(["dances", "and", "performances", "."], { inline: true })).eq("dances/nns and/cc performances/nns .");
    expect(RiTa.tagger.tag(["cakes", "quickly", "."], { inline: true })).eq("cakes/nns quickly/rb .");
    expect(RiTa.tagger.tag(["dances", "quickly", "."], { inline: true })).eq("dances/vbz quickly/rb .");
    expect(RiTa.tagger.tag(["David", "cakes", "."], { inline: true })).eq("David/nnp cakes/nns .");
    expect(RiTa.tagger.tag(["David", "laughs", "and", "dances", "."], { inline: true })).eq("David/nnp laughs/vbz and/cc dances/vbz .");
    expect(RiTa.tagger.tag(["counterattacks", "."], { inline: true })).eq("counterattacks/nns .");
    expect(RiTa.tagger.tag(["Monkeys", "run", "."], { inline: true })).eq("Monkeys/nns run/vbp .");
    expect(RiTa.tagger.tag(["Monkeys", "attack", "."], { inline: true })).eq("Monkeys/nns attack/vbp .");
    expect(RiTa.tagger.tag(["A", "light", "blue", "sky", "."], { inline: true })).eq("A/dt light/jj blue/jj sky/nn .");
    expect(RiTa.tagger.tag(["It", "broke", "."], { inline: true })).eq("It/prp broke/vbd .");
    expect(RiTa.tagger.tag(["It", "outpaced", "that", "."], { inline: true })).eq("It/prp outpaced/vbd that/in .");
    expect(RiTa.tagger.tag(["She", "remade", "this", "video", "."], { inline: true })).eq("She/prp remade/vbd this/dt video/nn .");
    expect(RiTa.tagger.tag(["She", "has", "remade", "this", "video", "."], { inline: true })).eq("She/prp has/vbz remade/vbn this/dt video/nn .");
  });
  it("Should handle hyphenated words in sentence", () => {
    let pool = [
      "He is my father-in-law.",
      "We have a off-site meeting yesterday.",
      "I know a great place for an off-site.",
      "a state-of-the-art computer",
      "The girls wanted the merry-go-round to go faster.",
      "He ate twenty-one burgers today.",
      "The politician arrived by high-speed railway.",
      "People doing yoga benefit from an increased feeling of well-being.",
      "There is a life-size statue of the dragon in the park.",
      "He has a king-size bed in his room.",
      "I am taking a full-time job now",
      "The cost for the round-trip ticket is 2000 dollars.",
      "The cost is 2000 dollars for the round-trip.",
      "He come back empty-handed",
      "She is left-handed",
      "I like the dress of the long-haired girl in the photo.",
      "His move was breath-taking.",
      "Snakes are cold-blooded.",
      "People liked to wear bell-bottoms in the 80s.",
      "This shop mainly sells corn-fed meat.",
      "I withdraw the application and re-apply for another position.",
      "Our co-manager believe in neo-liberalism.",
      "He did a u-turn.",
      "We are not going to get down to the nitty-gritty analysis of value for money.",
      "The game require co-op with your teammates.",
      "He was a roly-poly little man."
    ];
    let answers = [
      ["prp", "vbz", "prp$", "nn", "."],
      ["prp", "vbp", "dt", "jj", "vbg", "nn", "."],
      ["prp", "vbp", "dt", "jj", "nn", "in", "dt", "nn", "."],
      ["dt", "jj", "nn"],
      ["dt", "nns", "vbd", "dt", "nn", "to", "vb", "rbr", "."],
      ["prp", "vbd", "cd", "nns", "nn", "."],
      ["dt", "nn", "vbd", "in", "jj", "nn", "."],
      ["nn", "vbg", "nn", "nn", "in", "dt", "jj", "vbg", "in", "nn", "."],
      ["ex", "vbz", "dt", "jj", "nn", "in", "dt", "nn", "in", "dt", "nn", "."],
      ["prp", "vbz", "dt", "jj", "nn", "in", "prp$", "nn", "."],
      ["prp", "vbp", "vbg", "dt", "jj", "nn", "rb"],
      ["dt", "nn", "in", "dt", "jj", "nn", "vbz", "cd", "nns", "."],
      ["dt", "nn", "vbz", "cd", "nns", "in", "dt", "nn", "."],
      ["prp", "vbp", "rb", "jj"],
      ["prp", "vbz", "jj"],
      ["prp", "vbp", "dt", "nn", "in", "dt", "jj", "nn", "in", "dt", "nn", "."],
      ["prp$", "nn", "vbd", "jj", "."],
      ["nns", "vbp", "jj", "."],
      ["nn", "vbd", "to", "vb", "nn", "in", "dt", "nns", "."],
      ["dt", "nn", "rb", "nns", "jj", "nn", "."],
      ["prp", "vbp", "dt", "nn", "cc", "vb", "in", "dt", "nn", "."],
      ["prp$", "nn", "vbp", "in", "nn", "."],
      ["prp", "vbd", "dt", "nn", "."],
      ["prp", "vbp", "rb", "vbg", "to", "vb", "rb", "to", "dt", "nn", "nn", "in", "nn", "in", "nn", "."],
      ["dt", "nn", "vb", "nn", "in", "prp$", "nns", "."],
      ["prp", "vbd", "dt", "jj", "jj", "nn", "."]
    ];
    answers.forEach((a, i) => {
      expect(RiTa.pos(pool[i])).eql(a, "fail at: " + pool[i]);
    });
  });
});
