
const aboutModalStyles = `
.modal-overlay{

    position:fixed;
    inset:0;

    background:rgba(0,0,0,.45);

    display:flex;
    justify-content:center;
    align-items:center;

    z-index:9999;
}
.modal-box{

    width:450px;
    max-width:90%;

    background:#fff;

    border-radius:20px;

    padding:30px;

    text-align:center;

    box-shadow:0 15px 40px rgba(0,0,0,.2);
}
.modal-box h2{

    color:#1D4ED8;

    margin-bottom:8px;
}
.version{

    color:#64748B;

    margin-bottom:25px;

    font-size: 17px;
}
.about-content{

    color:#475569;

    line-height:1.7;

    margin-bottom:30px;
}
.save-btn{

    width:140px;
    height:46px;

    border:none;

    border-radius:12px;

    background:#2563EB;

    color:white;

    cursor:pointer;

    font-weight:600;

    transition:.25s;
}

.save-btn:hover{

    background:#1D4ED8;
}
`;

function AboutModal({ show, onClose }) {

  if (!show) return null;

  return (

    <div className="modal-overlay">
      <style>{aboutModalStyles}</style>

      <div className="modal-box">

        <h2>HiDocs!</h2>

        <p className="version">
          Version 1.0.0
        </p>

        <div className="about-content">

          <p>
            HiDocs is a web application designed to help
            users fill out surveys, quizzes, and digital
            forms quickly and efficiently.
          </p>

          <br />

          <p>
            Developed by
            <br />
            <strong>Kelompok 4</strong>
          </p>

        </div>

        <button
          className="save-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </div>

  );

}

export default AboutModal;