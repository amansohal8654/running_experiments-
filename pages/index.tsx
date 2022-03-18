import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import ExperimentList from './experiments/list'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <ExperimentList />
    </div>
  )
}

export default Home
