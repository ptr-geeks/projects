import 'package:tarok/messages.pb.dart' as Messages;
import 'package:stockskis/stockskis.dart' as stockskis;

class PredictionsCompLayer {
  // compatibility layer between Messages.Predictions and stockskis.Predictions

  static stockskis.Predictions messagesToStockSkis(
      Messages.Predictions message) {
    return stockskis.Predictions(
      kraljUltimo: stockskis.SimpleUser(
        id: message.kraljUltimo.id,
        name: message.kraljUltimo.name,
      ),
      kraljUltimoKontra: message.kraljUltimoKontra,
      kraljUltimoKontraDal: stockskis.SimpleUser(
        id: message.kraljUltimoKontraDal.id,
        name: message.kraljUltimoKontraDal.name,
      ),
      trula: stockskis.SimpleUser(
        id: message.trula.id,
        name: message.trula.name,
      ),
      kralji: stockskis.SimpleUser(
        id: message.kralji.id,
        name: message.kralji.name,
      ),
      igra: stockskis.SimpleUser(
        id: message.igra.id,
        name: message.igra.name,
      ),
      igraKontra: message.igraKontra,
      igraKontraDal: stockskis.SimpleUser(
        id: message.igraKontraDal.id,
        name: message.igraKontraDal.name,
      ),
      pagatUltimo: stockskis.SimpleUser(
        id: message.pagatUltimo.id,
        name: message.pagatUltimo.name,
      ),
      pagatUltimoKontra: message.pagatUltimoKontra,
      pagatUltimoKontraDal: stockskis.SimpleUser(
        id: message.pagatUltimoKontraDal.id,
        name: message.pagatUltimoKontraDal.name,
      ),
      valat: stockskis.SimpleUser(
        id: message.valat.id,
        name: message.valat.name,
      ),
      valatKontra: message.valatKontra,
      valatKontraDal: stockskis.SimpleUser(
        id: message.valatKontraDal.id,
        name: message.valatKontraDal.name,
      ),
      barvniValat: stockskis.SimpleUser(
        id: message.barvniValat.id,
        name: message.barvniValat.name,
      ),
      barvniValatKontra: message.barvniValatKontra,
      barvniValatKontraDal: stockskis.SimpleUser(
        id: message.barvniValatKontraDal.id,
        name: message.barvniValatKontraDal.name,
      ),
      gamemode: message.gamemode,
      changed: message.changed,
    );
  }

  static Messages.Predictions stockSkisToMessages(
      stockskis.Predictions message) {
    return Messages.Predictions(
      kraljUltimo: Messages.User(
        id: message.kraljUltimo.id,
        name: message.kraljUltimo.name,
      ),
      kraljUltimoKontra: message.kraljUltimoKontra,
      kraljUltimoKontraDal: Messages.User(
        id: message.kraljUltimoKontraDal.id,
        name: message.kraljUltimoKontraDal.name,
      ),
      trula: Messages.User(
        id: message.trula.id,
        name: message.trula.name,
      ),
      kralji: Messages.User(
        id: message.kralji.id,
        name: message.kralji.name,
      ),
      igra: Messages.User(
        id: message.igra.id,
        name: message.igra.name,
      ),
      igraKontra: message.igraKontra,
      igraKontraDal: Messages.User(
        id: message.igraKontraDal.id,
        name: message.igraKontraDal.name,
      ),
      pagatUltimo: Messages.User(
        id: message.pagatUltimo.id,
        name: message.pagatUltimo.name,
      ),
      pagatUltimoKontra: message.pagatUltimoKontra,
      pagatUltimoKontraDal: Messages.User(
        id: message.pagatUltimoKontraDal.id,
        name: message.pagatUltimoKontraDal.name,
      ),
      valat: Messages.User(
        id: message.valat.id,
        name: message.valat.name,
      ),
      valatKontra: message.valatKontra,
      valatKontraDal: Messages.User(
        id: message.valatKontraDal.id,
        name: message.valatKontraDal.name,
      ),
      barvniValat: Messages.User(
        id: message.barvniValat.id,
        name: message.barvniValat.name,
      ),
      barvniValatKontra: message.barvniValatKontra,
      barvniValatKontraDal: Messages.User(
        id: message.barvniValatKontraDal.id,
        name: message.barvniValatKontraDal.name,
      ),
      gamemode: message.gamemode,
      changed: message.changed,
    );
  }
}
