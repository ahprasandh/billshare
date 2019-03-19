import fb from "./firebaseConfig";

export default {
  login(email, password, successCallBack, errorCallBack) {
    fb.auth
      .signInWithEmailAndPassword(email, password)
      .then(successCallBack, errorCallBack);
  },
  logout(callback) {
    fb.auth.signOut().then(callback);
  },
  createGuest(successCallBack, errorCallBack) {
    fb.auth
      .createUserWithEmailAndPassword("guest@domain.com", "guest@123")
      .then(successCallBack, errorCallBack);
  },
  getSettings(callback) {
    fb.settings.get().then(callback);
  },
  saveSettings(settings, callback) {
    fb.settings
      .set(settings, {
        merge: true
      })
      .then(callback);
  },
  getPhotos(callback) {
    fb.photos.onSnapshot(querySnapshot => {
      var photoCollection = [];
      querySnapshot.forEach(doc => {
        photoCollection.push({
          data: doc.data().data,
          id: doc.id
        });
        if (photoCollection.length === querySnapshot.size) {
          callback(photoCollection);
        }
      });
    });
  },
  savePhoto(id, base64Photo, successCallBack, errorCallBack) {
    fb.photos
      .doc(id)
      .set({
        data: base64Photo
      })
      .then(successCallBack)
      .catch(errorCallBack);
  },
  getPersonList(callback) {
    fb.personCollection.orderBy("payment", "desc").onSnapshot(querySnapshot => {
      var personCollection = [];
      querySnapshot.forEach(doc => {
        let person = doc.data();
        person.id = doc.id;
        person.modified = false;
        person.expand = false;
        person.modify = {
          name: null,
          cost: 0,
          toPay: 0,
          mode: null
        };
        personCollection.push(person);
        if (personCollection.length === querySnapshot.size) {
          callback(personCollection);
        }
      });
    });
  },
  addPerson(person, successCallBack, errorCallBack) {
    fb.personCollection
      .add(person)
      .then(ref => {
        successCallBack(ref.id);
      })
      .catch(errorCallBack);
  },
  editPerson(id, person, successCallBack, errorCallBack) {
    fb.personCollection
      .doc(id)
      .set(person, {
        merge: true
      })
      .then(function() {
        successCallBack(id);
      })
      .catch(errorCallBack);
  },
  deletePerson(id, successCallBack, errorCallBack) {
    fb.personCollection
      .doc(id)
      .delete()
      .then(successCallBack)
      .catch(errorCallBack);
  },
  getExpenseList(callback) {
    fb.expenseCollection
      .orderBy("createdOn", "desc")
      .onSnapshot(querySnapshot => {
        var expenseCollection = [];
        querySnapshot.forEach(doc => {
          let expense = doc.data();
          expense.id = doc.id;
          expense.expand = false;
          expenseCollection.push(expense);
        });
        if (expenseCollection.length === querySnapshot.size) {
          callback(expenseCollection);
        }
      });
  },
  addExpense(expense, initialExpensePersons, successCallBack, errorCallBack) {
    fb.expenseCollection
      .add(expense)
      .then(ref => {
        expense.id = ref.id;
        successCallBack(expense, initialExpensePersons);
      })
      .catch(errorCallBack);
  },
  editExpense(
    id,
    expense,
    initialExpensePersons,
    successCallBack,
    errorCallBack
  ) {
    fb.expenseCollection
      .doc(id)
      .set(expense, {
        merge: true
      })
      .then(function() {
        expense.id = id;
        successCallBack(expense, initialExpensePersons);
      })
      .catch(errorCallBack);
  }
};
