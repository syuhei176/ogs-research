import { StaticChallenge, createStaticChallenge } from './static'
import { Proposition, CompiledPredicate } from './types'
import {
  DynamicChallengeResolver,
  createDynamicChallengeResolver
} from './dynamic'

export class Challenge {
  validChallenges: StaticChallenge[] = []
  constructor(
    readonly staticChallenge: StaticChallenge,
    readonly dynamicChallengeResolver: DynamicChallengeResolver
  ) {
    this.validChallenges.push(staticChallenge)
    this.traverse(staticChallenge, compiledPredocate => {
      this.validChallenges.push(
        createStaticChallenge(compiledPredocate.decompile())
      )
    })
  }

  static fromProposition(proposition: Proposition): Challenge {
    return new Challenge(
      createStaticChallenge(proposition),
      createDynamicChallengeResolver(proposition)
    )
  }

  /**
   * @name getChallenge
   * @description returns possible valid challenges
   */
  getChallenge(): StaticChallenge {
    return this.staticChallenge
  }

  getChallenges(): StaticChallenge[] {
    return this.validChallenges
  }

  private traverse(
    staticChallenge: StaticChallenge | Proposition,
    handler: (compiledPredicate: CompiledPredicate) => void
  ) {
    const innerTraverse = (staticChallenge: StaticChallenge | Proposition) => {
      if (staticChallenge.type === 'AtomicPredicate') {
      } else if (staticChallenge.type === 'CompiledPredicate') {
        handler(staticChallenge)
      } else if (staticChallenge.type === 'StaticAnd') {
        staticChallenge.children.map(innerTraverse)
      } else if (
        staticChallenge.type === 'And' ||
        staticChallenge.type === 'Or'
      ) {
        staticChallenge.children.map(innerTraverse)
      } else {
        innerTraverse(staticChallenge.child)
      }
    }
    innerTraverse(staticChallenge)
  }

  /**
   * @name getChallengeWithInputs
   * @description returns valid challenge of proposition with challengeInputs instantly.
   * @param challengeInputs
   */
  getChallengeWithInputs(challengeInputs: any[]): Proposition {
    let resolver: DynamicChallengeResolver | Proposition = this
      .dynamicChallengeResolver
    for (let i of challengeInputs) {
      resolver = (resolver as DynamicChallengeResolver)(i)
    }
    return resolver as Proposition
  }
}
