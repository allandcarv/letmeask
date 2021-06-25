import { useHistory, useParams } from 'react-router-dom';

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import '../styles/room.scss';

import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
  
type RoomParams =  {
  id: string
}

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const { questions, title } = useRoom(params.id);

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar esta sala?')) {
      await database.ref(`rooms/${params.id}`).update({
        endedAt: new Date()
      })

      history.push('/');
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${params.id}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Let Me Ask" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined={true} onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {
            questions.map(question => 
              <Question 
                content={question.content} 
                author={question.author} 
                key={question.id} 
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Delete Button" />
                </button>
              </Question>
            )
          }
        </div>
      </main>
    </div>
  )
}