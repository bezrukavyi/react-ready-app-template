import React from 'react'
import { replace } from 'react-router-redux'
import { isFunction } from 'lodash'

import Route from './MetaRoute'
import { store } from 'store'
import User from 'store/User'
import * as appPath from 'constants/Path'
import { Preloader } from 'components'
import Layouts from 'components/Layouts'

const AuthRoute = ({ layout, match, path, component: Component, onSuccess, ...rest }) => {
  User.actions.checkAuthCredentials()
  const user = User.selectors.entity()

  if (!user) {
    store.dispatch(User.actions.validateToken())
    .then(response => isFunction(onSuccess) ? store.dispatch(onSuccess(response)) : response)
    .then(response => store.dispatch(replace(match)))
    .catch(reject => store.dispatch(replace(appPath.ROOT)))
  }

  return (
    <Route path={path} {...rest} render={props => (
      user
      ? <Layouts.Auth><Component { ...props} /></Layouts.Auth>
      : <Preloader loading={true} />
    )}/>
  )
}

export default AuthRoute
