import { Challenge } from '.'
import { compile } from './compile'
import { Proposition } from './types'

const p: Proposition = {
  type: 'All',
  variable: 'b',
  child: {
    type: 'And',
    children: [
      { type: 'Not', child: { type: 'AtomicPredicate', inputs: [] } },
      {
        type: 'Or',
        children: [
          {
            type: 'Any',
            variable: 'c',
            child: { type: 'AtomicPredicate', inputs: [] }
          },
          { type: 'AtomicPredicate', inputs: [] }
        ]
      }
    ]
  }
}

const c = compile(p)

const a = Challenge.fromProposition(c)

console.log('getting challenge statically')
console.log(JSON.stringify(a.getChallenges(), undefined, 1))
console.log('getting challenge dynamically')
console.log(
  JSON.stringify(a.getChallengeWithInputs(['v', 1, undefined]), undefined, 1)
)
