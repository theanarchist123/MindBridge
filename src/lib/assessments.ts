export const PHQ9 = {
  name: 'PHQ-9',
  title: 'Depression Screening',
  subtitle: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  questions: [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
    'Trouble concentrating on things, such as reading the newspaper or watching television',
    'Moving or speaking so slowly that other people could have noticed. Or so fidgety or restless that you have been moving around a lot more than usual',
    'Thoughts that you would be better off dead, or of hurting yourself in some way',
  ],
  isCrisisQuestion: (index: number) => index === 8, // Q9 = crisis trigger
  score: (answers: number[]) => answers.reduce((a, b) => a + b, 0),
  severity: (score: number) => {
    if (score <= 4) return { label: 'Minimal', tier: 1, color: 'green' }
    if (score <= 9) return { label: 'Mild', tier: 1, color: 'yellow' }
    if (score <= 14) return { label: 'Moderate', tier: 2, color: 'orange' }
    return { label: 'Severe', tier: 3, color: 'red' }
  }
}

export const GAD7 = {
  name: 'GAD-7',
  title: 'Anxiety Screening',
  subtitle: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  questions: [
    'Feeling nervous, anxious, or on edge',
    'Not being able to stop or control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being so restless that it\'s hard to sit still',
    'Becoming easily annoyed or irritable',
    'Feeling afraid as if something awful might happen',
  ],
  score: (answers: number[]) => answers.reduce((a, b) => a + b, 0),
  severity: (score: number) => {
    if (score <= 4) return { label: 'Minimal', tier: 1, color: 'green' }
    if (score <= 9) return { label: 'Mild', tier: 1, color: 'yellow' }
    if (score <= 14) return { label: 'Moderate', tier: 2, color: 'orange' }
    return { label: 'Severe', tier: 3, color: 'red' }
  }
}

export const PSS10 = {
  name: 'PSS-10',
  title: 'Academic Stress Screening',
  subtitle: 'In the last month, how often have you felt or thought the following?',
  options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'],
  questions: [
    'Been upset because of something that happened unexpectedly',
    'Felt that you were unable to control the important things in your life',
    'Felt nervous and stressed',
    'Felt confident about your ability to handle your personal problems',
    'Felt that things were going your way',
    'Found that you could not cope with all the things that you had to do',
    'Been able to control irritations in your life',
    'Felt that you were on top of things',
    'Been angered because of things that were outside of your control',
    'Felt difficulties were piling up so high that you could not overcome them',
  ],
  // PSS-10: questions 4,5,7,8 are reverse scored
  reverseItems: [3, 4, 6, 7],
  score: (answers: number[]) => {
    const reversed = [3, 4, 6, 7]
    return answers.reduce((sum, val, i) => {
      return sum + (reversed.includes(i) ? (4 - val) : val)
    }, 0)
  },
  severity: (score: number) => {
    if (score <= 13) return { label: 'Low Stress', tier: 1, color: 'green' }
    if (score <= 26) return { label: 'Moderate Stress', tier: 2, color: 'orange' }
    return { label: 'High Stress', tier: 3, color: 'red' }
  }
}
