import { Proposition } from './types'

export type DynamicChallengeResolver = (
  challengeInput: any
) => Proposition | DynamicChallengeResolver

export function createDynamicChallengeResolver(
  proposition: Proposition
): DynamicChallengeResolver {
  if (proposition.type === 'And') {
    return (challengeInput: number) => {
      const c = proposition.children[challengeInput]
      if (c.type === 'CompiledPredicate') {
        return createDynamicChallengeResolver(c.decompile())
      } else {
        return {
          type: 'Not',
          child: proposition.children[challengeInput]
        }
      }
    }
  } else if (proposition.type === 'Or') {
    return () => {
      return {
        type: 'And',
        children: proposition.children.map(c => {
          if (c.type === 'Not') {
            return c.child
          } else {
            return { type: 'Not', child: c }
          }
        })
      }
    }
  } else if (proposition.type === 'Not') {
    return () => proposition.child
  } else if (proposition.type === 'All') {
    return (challengeInput: string) => {
      if (proposition.child.type === 'CompiledPredicate') {
        return createDynamicChallengeResolver(proposition.child.decompile())
      } else {
        return {
          type: 'Not',
          child: proposition.child
        }
      }
    }
  } else if (proposition.type === 'Any') {
    return (challengeInput: string) => {
      return {
        type: 'All',
        variable: proposition.variable,
        child: {
          type: 'Not',
          child: proposition.child
        }
      }
    }
  } else if (proposition.type === 'CompiledPredicate') {
    return createDynamicChallengeResolver(proposition.decompile())
  } else {
    throw new Error(`${proposition.type} found`)
  }
}
