/*
 * Copyright 2017-18 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ExecType } from './command'
import { Tab } from '../webapp/tab'
import { Stream, Streamable, StreamableFactory } from './streamable'
import { Block } from '../webapp/models/block'
import { Abortable, FlowControllable } from '../core/jobs/job'

export interface ExecOptions {
  /** force execution in a given tab? */
  tab?: Tab

  /** execution UUID */
  execUUID?: string

  /** pass through uninterpreted data */
  data?: string | Buffer

  /** environment variable map */
  env?: Record<string, string>

  /** true, if you wish a qexec to return rendered HTML; default is false, meaning you get the model back on qexec */
  render?: boolean

  /*
   * always show the view in terminal, e.g. for certain commands producing watchable table,
   * we want them to always show in `Terminal`
   */
  alwaysViewIn?: 'Terminal'

  isProxied?: boolean
  noDelegation?: boolean
  delegationOk?: boolean

  leaveBottomStripeAlone?: boolean

  filter?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  contextChangeOK?: boolean
  credentials?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

  custom?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  rawResponse?: boolean
  isDrilldown?: boolean
  block?: Block
  nextBlock?: HTMLElement
  placeholder?: string
  replSilence?: boolean
  quiet?: boolean
  intentional?: boolean
  noHistory?: boolean
  pip?: { container: string; returnTo: string }
  history?: number
  echo?: boolean
  nested?: boolean
  failWithUsage?: boolean
  rethrowErrors?: boolean
  reportErrors?: boolean
  preserveBackButton?: boolean
  type?: ExecType

  exec?: 'pexec' | 'qexec' | 'rexec'

  container?: Element
  raw?: boolean
  createOnly?: boolean
  noHeader?: boolean
  noStatus?: boolean
  noSidecarHeader?: boolean
  noRetry?: boolean
  showHeader?: boolean
  alreadyWatching?: boolean

  createOutputStream?: StreamableFactory
  stdout?: (str: Streamable) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  stderr?: (str: string) => any // eslint-disable-line @typescript-eslint/no-explicit-any

  /** on job init, pass the job, and get back a stdout; i.e. just before the PTY is brought up */
  onInit?: (job: Abortable & FlowControllable) => Stream | Promise<Stream>

  /** on job ready, i.e. after the PTY is up, but before any data has been processed */
  onReady?: (job: Abortable & FlowControllable) => void | Promise<void>

  /** on job exit, pass the exitCode */
  onExit?: (job: Abortable & FlowControllable, exitCode: number) => void

  parameters?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  entity?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface LanguageBearing extends ExecOptions {
  /** navigator.language */
  language: string
}

export function hasLanguage(execOptions: ExecOptions): execOptions is LanguageBearing {
  return (execOptions as LanguageBearing).language !== undefined
}

export function withLanguage(execOptions: ExecOptions): LanguageBearing {
  if (hasLanguage(execOptions)) {
    return execOptions
  } else {
    return Object.assign({}, execOptions, { language: typeof navigator !== 'undefined' && navigator.language })
  }
}

export class DefaultExecOptions implements ExecOptions {
  public readonly type: ExecType
  public readonly language: string

  public constructor(type: ExecType = ExecType.TopLevel) {
    this.type = type
    this.language = typeof navigator !== 'undefined' && navigator.language
  }
}

export class DefaultExecOptionsForTab extends DefaultExecOptions {
  public readonly tab: Tab
  public readonly block: Block

  public constructor(tab: Tab, block: Block) {
    super()
    this.tab = tab
    this.block = block
  }
}
