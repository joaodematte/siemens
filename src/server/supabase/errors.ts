const authErrorsCodes = {
  anonymous_provider_disabled: 'Logins anônimos estão desativados.',
  bad_code_verifier:
    'O verificador de código fornecido não corresponde ao esperado. Indica um bug na implementação da biblioteca do cliente.',
  bad_json: 'O corpo da requisição HTTP não é um JSON válido.',
  bad_jwt: 'O JWT enviado no cabeçalho de Autorização não é válido.',
  bad_oauth_callback:
    'O callback OAuth do provedor para Auth não tem todos os atributos necessários (state). Indica um problema com o provedor OAuth ou com a implementação da biblioteca do cliente.',
  bad_oauth_state:
    'O estado OAuth (dados retornados pelo provedor OAuth para o Supabase Auth) não está no formato correto. Indica um problema com a integração do provedor OAuth.',
  captcha_failed:
    'O desafio de captcha não pôde ser verificado com o provedor de captcha. Verifique sua integração de captcha.',
  conflict:
    'Conflito geral de banco de dados, como requisições concorrentes em recursos que não devem ser modificados simultaneamente. Pode ocorrer quando há muitas solicitações de atualização de sessão disparando ao mesmo tempo para um usuário. Verifique seu aplicativo para problemas de concorrência e, se detectados, faça um recuo exponencial.',
  email_address_not_authorized:
    'O envio de e-mail não é permitido para este endereço, pois seu projeto está usando o serviço SMTP padrão. Os e-mails só podem ser enviados para membros da sua organização Supabase. Se você deseja enviar e-mails para outros, configure um provedor SMTP personalizado.',
  email_conflict_identity_not_deletable:
    'Desvincular esta identidade faz com que a conta do usuário mude para um endereço de e-mail que já é usado por outra conta de usuário. Indica um problema em que o usuário tem duas contas diferentes usando endereços de e-mail primários diferentes. Você pode precisar migrar os dados do usuário para uma de suas contas neste caso.',
  email_exists: 'O endereço de e-mail já existe no sistema.',
  email_not_confirmed:
    'O login não é permitido para este usuário, pois o endereço de e-mail não está confirmado.',
  email_provider_disabled: 'Cadastros estão desativados para e-mail e senha.',
  flow_state_expired:
    'O estado do fluxo PKCE ao qual a requisição da API se refere expirou. Peça ao usuário para fazer login novamente.',
  flow_state_not_found:
    'O estado do fluxo PKCE ao qual a requisição da API se refere não existe mais. Os estados de fluxo expiram após um tempo e são progressivamente limpos, o que pode causar este erro. Requisições repetidas podem causar este erro, pois a requisição anterior provavelmente destruiu o estado do fluxo. Peça ao usuário para fazer login novamente.',
  hook_payload_over_size_limit:
    'A carga útil do Auth excede o limite máximo de tamanho.',
  hook_timeout:
    'Não foi possível alcançar o hook dentro do tempo máximo alocado.',
  hook_timeout_after_retry:
    'Não foi possível alcançar o hook após o número máximo de tentativas.',
  identity_already_exists:
    'A identidade à qual a API se refere já está vinculada a um usuário.',
  identity_not_found:
    'A identidade à qual a chamada da API se refere não existe, como quando uma identidade é desvinculada ou excluída.',
  insufficient_aal:
    'Para chamar esta API, o usuário deve ter um Nível de Garantia de Autenticador mais alto. Para resolver, peça ao usuário para resolver um desafio MFA.',
  invite_not_found: 'O convite expirou ou já foi usado.',
  invalid_credentials:
    'Credenciais de login ou tipo de concessão não reconhecidos.',
  manual_linking_disabled:
    'Chamar supabase.auth.linkUser() e APIs relacionadas não está habilitado no servidor Auth.',
  mfa_challenge_expired:
    'Responder a um desafio MFA deve acontecer dentro de um período de tempo fixo. Solicite um novo desafio ao encontrar este erro.',
  mfa_factor_name_conflict:
    'Fatores MFA para um único usuário não devem ter o mesmo nome amigável.',
  mfa_factor_not_found: 'O fator MFA não existe mais.',
  mfa_ip_address_mismatch:
    'O processo de registro para fatores MFA deve começar e terminar com o mesmo endereço IP.',
  mfa_verification_failed:
    'O desafio MFA não pôde ser verificado -- código TOTP incorreto.',
  mfa_verification_rejected:
    'Verificação adicional de MFA é rejeitada. Só é retornado se o hook de tentativa de verificação MFA retornar uma decisão de rejeição.',
  mfa_verified_factor_exists:
    'Fator de telefone verificado já existe para um usuário. Cancele o registro do fator de telefone verificado existente para continuar.',
  mfa_totp_enroll_disabled: 'O registro de fatores MFA TOTP está desativado.',
  mfa_totp_verify_disabled:
    'Login via fatores TOTP e verificação de novos fatores TOTP está desativado.',
  mfa_phone_enroll_disabled:
    'O registro de fatores MFA de telefone está desativado.',
  mfa_phone_verify_disabled:
    'Login via fatores de telefone e verificação de novos fatores de telefone está desativado.',
  no_authorization:
    'Esta requisição HTTP requer um cabeçalho de Autorização, que não foi fornecido.',
  not_admin:
    'O usuário acessando a API não é administrador, ou seja, o JWT não contém uma reivindicação de função que o identifique como administrador do servidor Auth.',
  oauth_provider_not_supported:
    'Usando um provedor OAuth que está desativado no servidor Auth.',
  otp_disabled:
    'Login com OTPs (link mágico, OTP por e-mail) está desativado. Verifique a configuração do seu servidor.',
  otp_expired:
    'O código OTP para este login expirou. Peça ao usuário para fazer login novamente.',
  over_email_send_rate_limit:
    'Muitos e-mails foram enviados para este endereço de e-mail. Peça ao usuário para esperar um pouco antes de tentar novamente.',
  over_request_rate_limit:
    'Muitas requisições foram enviadas por este cliente (endereço IP). Peça ao usuário para tentar novamente em alguns minutos. Às vezes pode indicar um bug em sua aplicação que envia muitas requisições por engano (como um hook useEffect do React mal escrito).',
  over_sms_send_rate_limit:
    'Muitas mensagens SMS foram enviadas para este número de telefone. Peça ao usuário para esperar um pouco antes de tentar novamente.',
  phone_exists: 'O número de telefone já existe no sistema.',
  phone_not_confirmed:
    'O login não é permitido para este usuário, pois o número de telefone não está confirmado.',
  phone_provider_disabled: 'Cadastros estão desativados para telefone e senha.',
  provider_disabled:
    'O provedor OAuth está desativado para uso. Verifique a configuração do seu servidor.',
  provider_email_needs_verification:
    'Nem todos os provedores OAuth verificam o endereço de e-mail de seus usuários. O Supabase Auth requer que os e-mails sejam verificados, então este erro é enviado quando um e-mail de verificação é enviado após completar o fluxo OAuth.',
  reauthentication_needed:
    'Um usuário precisa se reautenticar para alterar sua senha. Peça ao usuário para se reautenticar chamando a API supabase.auth.reauthenticate().',
  reauthentication_not_valid:
    'A verificação de uma reautenticação falhou, o código está incorreto. Peça ao usuário para inserir um novo código.',
  request_timeout:
    'O processamento da requisição demorou muito. Tente a requisição novamente.',
  same_password:
    'Um usuário que está atualizando sua senha deve usar uma senha diferente da atualmente usada.',
  saml_assertion_no_email:
    'A asserção SAML (informações do usuário) foi recebida após o login, mas nenhum endereço de e-mail foi encontrado nela, o que é necessário. Verifique o mapeamento de atributos e/ou configuração do provedor.',
  saml_assertion_no_user_id:
    'A asserção SAML (informações do usuário) foi recebida após o login, mas um ID de usuário (chamado NameID) não foi encontrado nela, o que é necessário. Verifique a configuração do provedor de identidade SAML.',
  saml_entity_id_mismatch:
    '(API de Admin.) Não é possível atualizar os metadados SAML para um provedor de identidade SAML, pois o ID da entidade na atualização não corresponde ao ID da entidade no banco de dados. Isso é equivalente a criar um novo provedor de identidade, e você deve fazer isso em vez disso.',
  saml_idp_already_exists:
    '(API de Admin.) Adicionando um provedor de identidade SAML que já foi adicionado.',
  saml_idp_not_found:
    'Provedor de identidade SAML não encontrado. Mais frequentemente retornado após o login iniciado pelo IdP com um provedor de identidade SAML não registrado no Supabase Auth.',
  saml_metadata_fetch_failed:
    '(API de Admin.) A adição ou atualização de um provedor SAML falhou, pois seus metadados não puderam ser buscados na URL fornecida.',
  saml_provider_disabled:
    'O uso de SSO Empresarial com SAML 2.0 não está habilitado no servidor Auth.',
  saml_relay_state_expired:
    'O estado de retransmissão SAML é um objeto que rastreia o progresso de uma requisição supabase.auth.signInWithSSO(). O provedor de identidade SAML deve responder após um tempo fixo, após o qual este erro é mostrado. Peça ao usuário para fazer login novamente.',
  saml_relay_state_not_found:
    'Os estados de retransmissão SAML são progressivamente limpos após expirarem, o que pode causar este erro. Peça ao usuário para fazer login novamente.',
  session_not_found:
    'A sessão à qual a requisição da API se refere não existe mais. Isso pode ocorrer se o usuário fez logout ou a entrada da sessão no banco de dados foi excluída de alguma outra forma.',
  signup_disabled:
    'Cadastros (criação de novas contas) estão desativados no servidor.',
  single_identity_not_deletable:
    'Cada usuário deve ter pelo menos uma identidade anexada a ele, então excluir (desvincular) uma identidade não é permitido se for a única para o usuário.',
  sms_send_failed:
    'O envio de uma mensagem SMS falhou. Verifique a configuração do seu provedor de SMS.',
  sso_domain_already_exists:
    '(API de Admin.) Apenas um domínio SSO pode ser registrado por provedor de identidade SSO.',
  sso_provider_not_found:
    'Provedor SSO não encontrado. Verifique os argumentos em supabase.auth.signInWithSSO().',
  too_many_enrolled_mfa_factors:
    'Um usuário só pode ter um número fixo de fatores MFA registrados.',
  unexpected_audience:
    '(Recurso obsoleto não disponível via bibliotecas cliente Supabase.) A reivindicação X-JWT-AUD da requisição não corresponde à audiência do JWT.',
  unexpected_failure:
    'O serviço Auth está degradado ou há um bug presente, sem um motivo específico.',
  user_already_exists:
    'Um usuário com estas informações (endereço de e-mail, número de telefone) não pode ser criado novamente, pois já existe.',
  user_banned:
    'O usuário ao qual a requisição da API se refere tem uma propriedade banned_until que ainda está ativa. Nenhuma outra requisição de API deve ser tentada até que este campo seja limpo.',
  user_not_found:
    'O usuário ao qual a requisição da API se refere não existe mais.',
  user_sso_managed:
    'Quando um usuário vem do SSO, certos campos do usuário não podem ser atualizados (como e-mail).',
  validation_failed: 'Os parâmetros fornecidos não estão no formato esperado.',
  weak_password:
    'O usuário está se cadastrando ou alterando sua senha sem atender aos critérios de força da senha. Use a classe AuthWeakPasswordError para acessar mais informações sobre o que eles precisam fazer para que a senha seja aprovada.'
};

export default authErrorsCodes;
