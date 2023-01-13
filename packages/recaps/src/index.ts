type CeramicWrite = {
  "ceramic/write": []
}

type Actions = CeramicWrite
type Capability = [string, Actions]
type Capablities = Array<Capability>

function validCeramicTarget(s: string): Uint8Array {
  // const modelResource = 
  // const streamResource = 
  // const allResource = ""
  return true
}

export class ReCap {
  _caps: Capablities

  constructor(caps:Capablities) {
    this._caps = caps
  }

  /**
   * Create ReCap instance from JSON representation
   */
  static fromJson(json:Map<string, Actions>):ReCap {
    // 
  }

  /**
   * Create ReCap instance from URI representation, typically from a SIWX message
   */
  static fromURI(recap: string): Recap {

  }

  /**
   * Encode ReCap to ReCap URI (urn:recap:base64url-encoded-recap) to be used in SIWX message
   */
  encode():string {
    //
  }

  /**
   * Query if this ReCap is valid for a given action and resource/target
   */
  can(action: Actions, target: string):boolean { 

  }

  /**
   * Generate the human readable ReCap statement for this ReCap, to be used in SIWX message
   */
  toStatement():string {

  }

  /**
   * Get JSON representation of ReCap
   */
  toJson():Map<string, Actions> {

  }

  /**
   * Add a capability (action & target) to a ReCap, returns new recap 
   */
  addCapability(action: Actions, target: string):ReCap {

  }

  /**
   * Verify that a ReCap Statement is valid for this ReCap and encodes the same delegations
   */
  verifyStatment(statement:string):boolean {

  }

  /**
   * Get array of resources inlcuded in ReCap
   */
  get resourceList(): Array<string> {

  }
  
  /**
   * Get array of actions for given resource/target
   */
  get actionsByResource(resource:string): Array<Actions> {

  }
}
  