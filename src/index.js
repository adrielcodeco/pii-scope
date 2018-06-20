/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import Scope from './scope'
import type { ScopeOptions } from './scope'

export default class {
  static New (path: string, options: ScopeOptions) {
    return Scope(path, options)
  }
}
