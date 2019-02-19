#!groovy

import jenkins.model.*
import hudson.security.*

def inst = Jenkins.getInstance()
def hudson = new HudsonPrivateSecurityRealm(false)
hudson.createAccount('user', 'password')
inst.setSecurityRealm(hudson)
def strat = new FullControlOnceLoggedInAuthorizationStrategy()
strat.setAllowAnonymousRead(false)
inst.setAuthorizationStrategy(strat)
inst.save()
