/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Card } from 'react-bootstrap';
import { Journals } from 'react-bootstrap-icons';
import assistant from 'assets/image/assistant.png';
import user from 'assets/image/user.png';

function ChatLog({ type, contents }: { type: string; contents: string }) {
  const logoImage = type === 'user' ? user : assistant;
  const nameStyle = type === 'user' ? '' : 'text-primary';
  const authorName = type === 'user' ? '사용자' : '상담사';
  return (
    <div className="d-flex my-3">
      <img src={logoImage} alt="profile img" width="50" height="50" />
      <div className="ms-4">
        <span className={nameStyle}>
          <b>{authorName}</b>
        </span>
        <span className="text-secondary ms-2"> 22:50 PM </span>

        <div>{contents} </div>
      </div>
    </div>
  );
}

const chagLog = [
  {
    role: 'assistant',
    contents: '만나서 반가워요. 오늘 하루는 어떤가요?',
    id: '234',
  },
  {
    role: 'user',
    contents:
      '밖을 나가서 사람들과 마주치면 사람들의 시선이 신경쓰인다. 나를 왜 쳐다볼까? 내가 이상하게 생겨서? 내가 싫어서? 동아리 활동을 하면서는 사람들의 표정하나하나가 다 신경이 쓰인다. 나를 싫어하면 어떡하지 하는 걱정이 심하다. 이렇게 힘들게 지내느니 그냥 혼자 방안에만 있는게 낫겠어.',
    id: '23123',
  },
  {
    role: 'assistant',
    contents:
      '그런 불안감과 스트레스를 느끼시는 것 같아 안타까워요. 혹시 이러한 생각이 자해 및 자살 관련 생각으로까지 이어진다면 말씀해주실 수 있나요?',
    id: '2341',
  },
  {
    role: 'user',
    contents:
      '자해는 해본적이 있고 자살도 생각해봤다. 자살하고 싶은 생각은 꽤 오래된것 같지만 실제로 할 용기는 없다. 부모님이 고통을 준것도 맞지만 고마운 면도 많고.. 부모님을 생각하면 자살까지 하진 못하지만, 그렇다고 살고 싶지도 않다. 그럴때면 이러지도 저러지도 못하는 나 스스로가 한심하고 그럴때 특히 자해를 하는 것 같다. 이런 모습을 남들이 알게되면 더더욱 바보로 여기겠지? 자기들은 그렇게 잘났나 하는 생각도 들지만, 정작 사람들 앞에서면 그런말 한마디도 못하니까',
    id: '231231',
  },
  {
    role: 'assistant',
    contents:
      '자해와 자살 생각을 가지고 계시다니 정말 마음이 아프네요. 지금까지 자해를 하신 횟수와 그때의 감정 상태에 대해서 좀 더 알려주실 수 있나요? 이런 상황에서 어떻게 도움을 드릴 수 있는지 알기 위해서입니다',
    id: '23224',
  },
  {
    role: 'user',
    contents:
      '자해는 셀 수 없이 했지. 횟수를 말하는게 의미가 있을까? 그때의 감정상태는 죽고 싶어서, 짜증나서. 남들은 바코드찍는다고 남들 보여주려고 한다던데 나는 숨겨. 나는 그냥 그렇게라도 안하면 진짜 미칠 것 같아서 하는거야. 그거말곤 딱히 스트레스를 풀게 없는 것 같애. 게임을 해라 운동을 해라 뭐 여러가지 말하던데 그런걸 할 기운도 힘도 없어. 그냥 긋고 피보고 자는 거. 그게 좋아. 그게 깔끔하고 편해',
    id: '2312223',
  },
  {
    role: 'assistant',
    contents:
      '자해를 통해서 스트레스를 해소하시는 것 같아 걱정이 되네요. 혹시 자살에 대한 생각이나 계획이 구체적으로 어떻게 되어 있는지 말씀해주실 수 있나요? 그리고 최근에 이러한 생각이 더 강해졌거나 약해졌다면 그 이유도 함께 말씀 부탁드립니다.',
    id: '2342',
  },
  {
    role: 'user',
    contents:
      '자살은 하고 싶지만 부모님 때문에 하고 싶지가 않다니까. 용기도 없고. 생각이 강해졌냐고 묻는다면 계속 강해져왔다고 봐야될 거 같은데',
    id: '2312223',
  },
  {
    role: 'assistant',
    contents:
      '부모님을 생각하시며 그 마음을 조절하고 계시다니 대단한 용기와 인내심이 있으신 것 같아요. 지금까지 어떤 방법으로 이러한 감정과 생각을 극복하거나 관리하려고 노력해오셨나요? 혹시 도움이 됐던 방법이 있다면 그것도 함께 알려주시면 좋겠어요.',
    id: '2342',
  },
  {
    role: 'user',
    contents:
      '부모님을 생각하면서 조절하는게 아니라 부모님이 마음에 걸려서 못하는 거야. 나는 대단한 용기와 인내심이 있다곤 생각안해 오히려 용기없고 겁많은 겁쟁이지. 죽을 용기도 없는 겁쟁이. 남들 눈치나 보고 다니는 겁쟁이. 죽고 싶은 생각을 극복하려고 자해를 한거지. 도움이 됐던 방법? 자해',
    id: '2312sdf223',
  },
  {
    role: 'assistant',
    contents:
      '그렇게 생각하시는군요. 말씀해주신 자해 외에도 다른 방법을 찾아보는 것도 좋을 것 같아요. 예를 들어, 친구나 가족과 이야기를 나누거나 전문가와 상담을 받아보는 것은 어떨까요? 또한 취미 활동이나 운동 등으로 스트레스를 풀어보는 것도 도움이 될 수 있습니다. 이런 방법들에 대해서 어떻게 생각하시나요?',
    id: '23sdf42',
  },
  {
    role: 'user',
    contents:
      '운동할 힘도 없고 기운도 없다고 이미 말을 했는데.. 전문가 상담은 이미 정신과 다니고 있어.',
    id: '231sdf2223',
  },
  {
    role: 'assistant',
    contents:
      '정신과를 다니고 계시다니, 그 점은 제가 간과했네요. 죄송합니다. 정신과에서의 상담이 어떤 방식으로 진행되고 있으며, 그 과정에서 느끼시는 점이나 변화가 있었다면 말씀해 주실 수 있을까요?',
    id: '2342dsf',
  },
  {
    role: 'user',
    contents:
      '그냥 힘든거 말하고 어떻게 하면 좋겠다하고 약받고 그래. 약먹으면 그때는 뭔가 몸이 늘어지는 것 같은데 이게 좋아지는 건지 그냥 졸린건지는 헷갈려. 그래도 안먹는것 보단 나아서 먹긴 하지만 혹시 정신과 다니는 걸 남들이 알게되면 어쩌지 하는 걱정이 계속 있어. 남들이 알게 되면 손가락질 하지 않을까? 스스로 자기 정신도 못챙겨서 병원이나 다니고. 웃기지 않아?',
    id: '23122dsf23',
  },
];
function EntireDiaryLogs() {
  return (
    <div className="mb-4">
      <div className="border-bottom mb-4 py-2">
        <div className="fs-2">
          <b> 2023년 3월 10일 18:44 </b>
        </div>
        <div className="text-secondary">8분 30초 참여 · 3032자 작성</div>
        <div className="text-primary"> 상담사명: 홍길동</div>
      </div>
      <Card bg="light" border="light">
        <Card.Body className="p-4">
          <Card.Title>
            <Journals />
            <span> 요약 </span>
          </Card.Title>
          <p className="text-secondary">
            오늘의 일기: 오늘은 사람들과 마주칠 때 불편하고 불안한 감정이
            들었다. 그런 생각들로 인해 자해와 자살에 대한 생각까지 했다.
            정신과를 다니고 있지만, 약이 정말 도움이 되는 건지, 그리고 남들이
            내가 정신과를 다니는 것을 알게 될까봐 걱정도 많다. 남들의 시선에
            대한 두려움 때문에 스스로에게 화가 나기도 한다. 이러한 감정을
            극복하고 관리할 수 있는 다른 방법을 찾아야겠다
          </p>
        </Card.Body>
      </Card>
      {chagLog.map((log) => (
        <ChatLog type={log.role} contents={log.contents} key={log.id} />
      ))}
    </div>
  );
}

export default EntireDiaryLogs;
