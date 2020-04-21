import { AtomicPredicate, CompiledPredicate, Proposition } from './types'

export function compile(
  proposition: Proposition
): CompiledPredicate | AtomicPredicate {
  const innerCompile = (proposition: Proposition): Proposition => {
    if (proposition.type === 'And' || proposition.type === 'Or') {
      return {
        type: proposition.type,
        children: proposition.children.map(compile)
      }
    } else if (proposition.type === 'Not') {
      return {
        type: proposition.type,
        child: compile(proposition.child)
      }
    } else if (proposition.type === 'All' || proposition.type === 'Any') {
      return {
        type: proposition.type,
        variable: proposition.variable,
        child: compile(proposition.child)
      }
    } else {
      return proposition
    }
  }
  if (proposition.type === 'AtomicPredicate') {
    return proposition
  } else {
    const c = innerCompile(proposition)
    return {
      type: 'CompiledPredicate',
      inputs: [],
      decompile: () => c
    }
  }
}
