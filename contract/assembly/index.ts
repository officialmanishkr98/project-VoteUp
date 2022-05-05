import { logging, PersistentMap } from "near-sdk-as";

const CandidateURL = new PersistentMap<string, string>("CandidateURL");
const CandidatePair = new PersistentMap<string, string[]>("Candidate Pair");
const PromptArray = new PersistentMap<string, string[]>("array of prompts");
const VoteArray = new PersistentMap<string, i32[]>("stores votes");
const DateOfPoll = new PersistentMap<string, string>("stores date of poll");
const userParticipation = new PersistentMap<string, string[]>(
  "user Participation Record"
);

// View Methods
// Does not change state of the blockchain
// Does not incur a fee
// Pulls and reads information from blockchain

export function getUrl(name: string): string {
  if (CandidateURL.contains(name)) {
    return CandidateURL.getSome(name);
  } else {
    logging.log(`can't find that user`);
    return "";
  }
}
export function getDateOfPoll(prompt: string): string {
    if (DateOfPoll.contains(prompt)) {
      return DateOfPoll.getSome(prompt);
    } else {
      logging.log(`can't find the poll for ` + prompt);
      return "";
    }
}

export function didParticipate(prompt: string, user: string): bool {
  if (userParticipation.contains(prompt)) {
    let getArray = userParticipation.getSome(prompt);
    return getArray.includes(user);
  } else {
    logging.log("prompt not found");
    return false;
  }
}

export function getAllPrompts(): string[] {
  if (PromptArray.contains("AllArrays")) {
    return PromptArray.getSome("AllArrays");
  } else {
    logging.log("no prompts found");
    return [];
  }
}

export function getVotes(prompt: string): i32[] {
  if (VoteArray.contains(prompt)) {
    return VoteArray.getSome(prompt);
  } else {
    logging.log("prompt not found for this vote");
    return [0, 0];
  }
}

export function getCandidatePair(prompt: string): string[] {
  if (CandidatePair.contains(prompt)) {
    return CandidatePair.getSome(prompt);
  } else {
    logging.log("prompt not found");
    return [];
  }
}

// Change Methods
// Changes state of Blockchain
// Costs a transaction fee to do so
// Adds or modifies information to blockchain

export function addUrl(name: string, url: string): void {
  CandidateURL.set(name, url);
  logging.log("added url for " + name);
}

export function addDate(prompt: string, date: string): void {
  DateOfPoll.set(prompt, date);
  logging.log("added date and time for " + prompt);
}

export function addCandidatePair(
  prompt: string,
  name1: string,
  name2: string
): void {
  CandidatePair.set(prompt, [name1, name2]);
}

export function addToPromptArray(prompt: string): void {
  if (PromptArray.contains("AllArrays")) {
    logging.log("add addition to prompt array");
    let tempArray = PromptArray.getSome("AllArrays");
    tempArray.push(prompt);
    PromptArray.set("AllArrays", tempArray);
    logging.log("added to prompt array");
  } else {
    PromptArray.set("AllArrays", [prompt]);
  }
}
export function removeFromPromptArray(prompt: string): void {
  if (PromptArray.contains("AllArrays")) {
    logging.log("removing from prompt array");
    let tempArray = PromptArray.getSome("AllArrays");
    if (tempArray.includes(prompt)) {
      tempArray.splice(tempArray.indexOf(prompt), 1);
      PromptArray.set("AllArrays", tempArray);
      logging.log(`removed ${prompt} from prompt array`);
    }
  } else {
    logging.log("no prompts found");
  }
}
export function clearPromptArray(): void {
  logging.log("clearing prompt array");
  PromptArray.delete("AllArrays");
}

export function addVote(prompt: string, index: i32): void {
  if (VoteArray.contains(prompt)) {
    let tempArray = VoteArray.getSome(prompt);
    let tempVal = tempArray[index];
    let newVal = tempVal + 1;
    tempArray[index] = newVal;
    VoteArray.set(prompt, tempArray);
  } else {
    let newArray = [0, 0];
    newArray[index] = 1;
    VoteArray.set(prompt, newArray);
  }
}

export function recordUser(prompt: string, user: string): void {
  if (userParticipation.contains(prompt)) {
    let tempArray = userParticipation.getSome(prompt);
    tempArray.push(user);
    userParticipation.set(prompt, tempArray);
  } else {
    userParticipation.set(prompt, [user]);
  }
}
