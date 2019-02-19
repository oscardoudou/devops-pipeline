#! groovy

import static jenkins.model.Jenkins.instance as jenk
import jenkins.install.InstallState

if(!jenk.installState.isSetupComplete()) {
  InstallState.INITIAL_SETUP_COMPLETED.initializeState()
}
