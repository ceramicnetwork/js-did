import Tonic from './tonic.js'
import { DIDSession } from 'did-session'
import { WebauthnAuth } from '../src/index'
import 'https://unpkg.com/ua-parser-js@1.0.35/src/ua-parser.js'

const { createDID, probeDIDs } = WebauthnAuth

class CompatChecker extends Tonic {
  step = 0

  connected () {
    if (getDIDs().length) {
      this.step++
      this.reRender()
    }
  }

  // @ts-ignore
  async click (ev: Event) {
    if (Tonic.match(ev.target, '#create')) {
      try {
      const did = await createDID('demoapp-user')
      setDIDs(did)
      this.step++
      this.reRender()
      } catch (err) {
        handleError(err, 'Failed to create an identity')
      }
    }

    if (Tonic.match(ev.target, '#auth')) {
      const dids = getDIDs()
      if (!dids.length) return
      let seen: Array<string> = []
      const selectDID: WebauthnAuth.DIDSelector = async (a, b) => {
        if (dids.includes(a)) return a
        if (dids.includes(b)) return b
        seen = [a, b]
        console.error('Keyselection is about to fail', [a, b], 'is not in', dids)
      }

      try {
        const authMethod = await WebauthnAuth.getAuthMethod({ selectDID })
        const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://nil'] })
        console.info('Session authorized', session)
        this.step++
        this.reRender()
      } catch (err) {
        if (err.message === 'PublicKeySelectionFailed') {
          handleError(err, this.html`
             <p>
              The identity you chose seem to be different from the one created|recovered in step 1.<br/>
              <br/>
              Please try again!
              <br/>
              <pre><code>Expected\n${dids.join('\n')}\nReceived:\n${seen.join('\n')}</code></pre>
             <p>
          `)
        } else handleError(err, 'Authentication Failed')
      }
    }


    if (Tonic.match(ev.target, '#recover')) {
      try {
        const dids = await probeDIDs()
        setDIDs(dids)
        this.step++
        this.reRender()
      } catch (err) {
        handleError(err, 'Key Recovery Failed')
      }
    }

    if (Tonic.match(ev.target, '#purge')) purge()
    if (Tonic.match(ev.target, '#btn-pop-last')) handleError()
  }

  render () {
    let fragment = this.html`<h2>Invalid State: ${this.step + ''}</h2>`

    // Wizard screen 1: Create/Recover
    if (this.step === 0) fragment = this.html`
      <p>
        We're trying to discover which webauthn configurations
        provide the best compatibility given different browsers/devices and dongles.<br/>
        Help appreciated.
      </p>

      <h3>Step 1: Acquire Key</h3>

      Choose <strong>Create Identity</strong> if this is your first visit.<br/>
      If you have a key created from another browser or device, select <strong>Recover Identity</strong>.<br/>
      <br/>
      <button id="create">Create Identity</button>
      <button id="recover">Recover Identity</button>
    `

    // Wizard screen 2: Login
    if (this.step === 1) {
      const { error, seen, expected } = this.props
      console.log('This.props', this.props)
      fragment = this.html`
        <h3>Step 2: Authenticate</h3>
        <p>
          Nice! <br/>
          Now we have hint of which identity you wish to use,<br/>
          let's try and sign in.
        </p>
        <button id="auth">Authenticate</button>
      `
    }

    // Wizard screen 3: Export Result
    if (this.step === 2) {
      fragment = this.html`
        <h3>Step 3: Result</h3>
        <result-formatter></result-formatter>
        <p style="text-align:center">Thanks! ✨</p>
      `
    }


    // Current DID header
    const dids = getDIDs()
    const currentIdentity = dids.length
      ? this.html`Current Session<pre>${dids.join('\n')}</pre>`
      : ''

    // @ts-ignore
    const ua = new window.UAParser().getResult()

    return this.html`
      <main class="container">
        <h2><samp>@didtools/key-webauthn</samp></h2>
        <div style="margin-top: -2em">
          <a style="float:right" href="https://github.com/ceramicnetwork/js-did/tree/main/packages/key-webauthn">Github</a><br/>
        </div>

        ${fragment}

        <hr>
        <button id="purge" class="secondary outline">Forget everything &amp; Restart</button>
        <details>
          <summary><code>Debug Info</code></summary>
          ${currentIdentity}
          User Agent:
          <pre>${JSON.stringify(ua, null, 2)}</pre>
          <button id="btn-pop-last">Show last error</button>
        </details>
        <error-dialog id="dlg-error"></error-dialog>
      </main>
    `
  }
}
Tonic.add(CompatChecker)

class ResultFormatter extends Tonic {
  fob = 'Yubikey v5'
  nfc = false
  change (ev: any) {
    if (Tonic.match(ev.target, '#select-fob')) {
      this.fob = ev.target.value
      this.reRender()
    }
    if (Tonic.match(ev.target, '#used-nfc')) {
      this.nfc = ev.target.checked
      this.reRender()
    }
  }

  // @ts-ignore
  click (ev: any) {
    if (Tonic.match(ev.target, '#copy')) {
      ev.preventDefault()
      // @ts-ignore
      const txt = this.querySelector('#result')?.value || '#result Element not found'
      navigator.clipboard.writeText(txt)
        .catch(err => console.error('clipcopy failed', err))
    }
  }

  render () {
    // @ts-ignore
    const { browser, os, device, cpu } = new window.UAParser().getResult()
    console.info({ browser, os, device, cpu })
    const o = `${os.name} ${os.version}`
    const options = [
      'Yubikey v5',
      'Yubikey v5 (USB-C)',
      'OS-Authenticator',
      'Other'
    ].map(v => this.html(`<option value="${v}" ${v === this.fob ? 'selected' : ''}>${v}</option>`))
    const dev = device?.type || 'desktop'
    return this.html`
      <select id="select-fob">${options}</select>
      <label for="used-nfc">
        <input id="used-nfc" name="used-nfc" type="checkbox" ${this.nfc ? 'checked' : ''}/>
        Used NFC/Contactless-blip login?
      </label>
      <br/>
      <p>Please share this result with us:</p>
      <textarea id="result">|${browser.name}|${browser.version}|${o}|${dev}|${this.nfc ? 'x' : ' '}|${this.fob}|</textarea>
      <div style="text-align: right">
        <a role="button" id="copy" href="#/">Copy to clipboard</a>
      </div>
      <br/>
    `
  }
}
Tonic.add(ResultFormatter)

function handleError(error?: Error, view?: any) {
  const dlg = document.getElementById('dlg-error') as unknown as ErrorDialog
  dlg.show(error, view)
}

class ErrorDialog extends Tonic {
  open = false
  error?: Error = undefined // Cache last error

  // @ts-ignore
  click (ev: any) {
    if (
      Tonic.match(ev.target, '.close') ||
      Tonic.match(ev.target, '#btn-close')
    ) {
      ev.preventDefault()
      this.open = false
      this.reRender()
    }

    if (Tonic.match(ev.target, '#copyerr')) {
      ev.preventDefault()
      // @ts-ignore
      const txt = this.querySelector('#log')?.value || '#log Element not found'
      navigator.clipboard.writeText(txt)
        .catch(err => console.error('clipcopy failed', err))
    }
  }

  show (error?: Error, view?: any) {
    this.open = true
    this.reRender(() => ({ error, view }))
  }

  render () {
    const { error, view } = this.props
    if (error) this.error = error
    const errFrag = !this.error ? '' : this.html`
          <p>
            A runtime error occured, please pass this on:
            <textarea id="log" rows="12">Message: ${this.error.message}\n\nStacktrace: ${this.error.stack || 'none'}</textarea>
            <div style="text-align: right">
              <a role="button" id="copyerr" href="#/">Copy to clipboard</a>
            </div>
          </p>
    `
    return this.html`
      <dialog ${this.open ? 'open' : ''}>
       <article>
          <header>
            <a href="#close" aria-label="Close" class="close"></a>
            Holy Carp!
          </header>
          ${view || ''}
          ${errFrag}
          <footer>
            <button id="btn-close">Okay</button>
          </footer>
        </article>
      </dialog>
    `
  }
}
Tonic.add(ErrorDialog)

/*
function getDID () { return window.localStorage.getItem('did') }
function setDID (did: string) { window.localStorage.setItem('did', did) }
*/
function getDIDs () {
  return JSON.parse(window.localStorage.getItem('dids') || '[]')
}
function setDIDs (dids: Array<string>|string) {
  if (!Array.isArray(dids)) dids = [dids]
  window.localStorage.setItem('dids', JSON.stringify(dids))
}

function purge () {
  window.localStorage.clear()
  window.location.reload()
}
