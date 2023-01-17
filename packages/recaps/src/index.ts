import { encodeBase64Url, base64urlToJSON } from 'did'
import * as u8a from 'uint8arrays'

type CeramicWrite = {
  "ceramic/write": []
}

type Actions = CeramicWrite
type Capability = [string, Actions]
type Capablities = Array<Capability>


type ReCapObject = {
  "att": Record<string, Actions>
  "prf": Array<string> 
}

function validCeramicTarget(s: string): Uint8Array {
  // TODO
  // const modelResource = 
  // const streamResource = 
  // const allResource = ""
  return true
}

//TODO validate recap urn
//TODO validate, add JSON schema, add ABNF 

function formatRecap(attenuations: { [k: string]: Actions}, prf: Array<string>) {
  return { att: attenuations, prf: prf ? prf : []}
}

const getAttenuations = (recap: ReCapObject): Record<string, Actions> => recap.att

const formatStatement = (delegee: string, attenuations: string) => 
  `I further authorize ${delegee} to perform the following actions on my behalf: ${attenuations}`

export class ReCap {
  _caps: Capablities
  _map: Map<string, Actions> | undefined

  constructor(caps:Capablities) {
    this._caps = caps
  }

  /**
   * Create ReCap instance from JSON representation
   */
  static fromJSON(json:ReCapObject):ReCap {
    return new ReCap(Object.entries(getAttenuations(json)))
  }

  /**
   * Create ReCap instance from URI representation, typically from a SIWX message
   */
  static fromURI(recap: string): ReCap {
    return ReCap.fromJSON(base64urlToJSON(recap.split(`:`).pop()))
  }

  /**
   * Encode ReCap to ReCap URI (urn:recap:base64url-encoded-recap) to be used in SIWX message
   */
  encodeURI():string {
    return `urn:recap:${encodeBase64Url(u8a.fromString(JSON.stringify(this.toJSON())))}`
  }

  /**
   * Query if this ReCap is valid for a given action and resource/target
   */
  // TODO only support action
  // @ts-ignore
  can(target: string, action: Actions):boolean { 
    return this.map.has(target) ? Boolean(this.map.get(target)?.["ceramic/write"]) : false
  }

  /**
   * Generate the human readable ReCap statement for this ReCap, to be used in SIWX message.
   */
  toStatement(delegee: string):string {
    const att = this._caps.reduce(
      (acc, cap, i) => `${acc} (${i+1}) "${Object.keys(cap[1]).pop()}" for "${cap[0]}".`, 
      ``)
    return formatStatement(delegee, att)
  }

  /**
   * Get JSON representation of ReCap
   */
  toJSON():ReCapObject {
    return formatRecap(Object.fromEntries(this.map), [])
  }
    
  //TODO assummes one action per target here
  get map():Map<string, Actions> {
    if (this._map) return this._map
    return this._caps.reduce((acc, cap) => Object.assign(acc, { [cap[0]]: cap[1]}), new Map())
  }

  /**
   * Add a capability (action & target) to a ReCap, returns new recap 
   */
  addCapability(target: string, action: Actions):ReCap {
    validCeramicTarget(target)
    return new ReCap(this._caps.concat([[target, action]]))
  }

  /**
   * Verify that a ReCap Statement is valid for this ReCap and encodes the same delegations
   */
  // TODO att/caps may not be ordered, unless spec says otherwise
  verifyStatment(statement:string, delegee: string):boolean {
    return this.toStatement(delegee) === statement
  }

  /**
   * Get array of resources inlcuded in ReCap
   */
  get resourceList(): Array<string> {
    return this._caps.map(cap => cap[0])
  }
  
  /**
   * Get array of actions for given resource/target
   */
  actionsByResource(resource:string): Array<Actions> {
    return this._caps.filter(cap => cap[0] === resource).map(cap => cap[1])
  }
}
  