interface And {
  type: 'And'
  children: Proposition[]
}

interface Or {
  type: 'Or'
  children: Proposition[]
}

interface Not {
  type: 'Not'
  child: Proposition
}

interface All {
  type: 'All'
  variable: string
  child: Proposition
}

interface Any {
  type: 'Any'
  variable: string
  child: Proposition
}

export interface AtomicPredicate {
  type: 'AtomicPredicate'
  inputs: string[]
}

export interface CompiledPredicate {
  type: 'CompiledPredicate'
  inputs: string[]
  decompile: () => Proposition
}

export type Proposition =
  | And
  | Or
  | Not
  | All
  | Any
  | AtomicPredicate
  | CompiledPredicate
