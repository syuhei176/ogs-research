import { Proposition } from './types'
import { createDynamicChallengeResolver } from './dynamic'

interface StaticAnd {
  type: 'StaticAnd'
  children: (StaticChallenge | Proposition)[]
}

interface StaticOr {
  type: 'StaticOr'
  child: Proposition
}

interface StaticNot {
  type: 'StaticNot'
  child: Proposition
}

interface StaticAll {
  type: 'StaticAll'
  variable: string
  child: StaticChallenge | Proposition
}

interface StaticAny {
  type: 'StaticAny'
  variable: string
  child: Proposition
}

export type StaticChallenge =
  | StaticAnd
  | StaticOr
  | StaticNot
  | StaticAll
  | StaticAny

export function createStaticChallenge(
  proposition: Proposition
): StaticChallenge {
  if (proposition.type === 'And') {
    return {
      type: 'StaticAnd',
      children: proposition.children.map(c => {
        if (c.type === 'CompiledPredicate') {
          return createStaticChallenge(c.decompile())
        } else {
          return {
            type: 'Not',
            child: c
          }
        }
      })
    }
  } else if (proposition.type === 'Or') {
    return {
      type: 'StaticOr',
      child: createDynamicChallengeResolver(proposition)(
        undefined
      ) as Proposition
    }
  } else if (proposition.type === 'Not') {
    return {
      type: 'StaticNot',
      child: createDynamicChallengeResolver(proposition)(
        undefined
      ) as Proposition
    }
  } else if (proposition.type === 'All') {
    let child: StaticChallenge | Proposition
    if (proposition.child.type === 'CompiledPredicate') {
      child = createStaticChallenge(proposition.child.decompile())
    } else {
      child = {
        type: 'Not',
        child: proposition.child
      }
    }
    return {
      type: 'StaticAll',
      variable: proposition.variable,
      child
    }
  } else if (proposition.type === 'Any') {
    return {
      type: 'StaticAny',
      variable: proposition.variable,
      child: {
        type: 'All',
        variable: proposition.variable,
        child: {
          type: 'Not',
          child: proposition.child
        }
      }
    }
  } else if (proposition.type === 'CompiledPredicate') {
    return createStaticChallenge(proposition.decompile())
  } else {
    throw new Error(`${proposition.type} found`)
  }
}
