from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.alert import Alert
import constants

import time
import pyautogui
import hashlib

def realEstate(issue):
    issue.update_status(1)
    regId = issue.data["regId"]
    fileName = hashlib.sha512((regId + str(time.time())).encode('utf-8')).hexdigest()
    print(fileName)

    try:
        issue.update_status(2)
        options = webdriver.ChromeOptions()
        prefs = {"protocol_handler": {"excluded_schemes": {"rprtregisterxctrl": "false"}}}
        options.add_experimental_option("prefs", prefs)
        # options.add_argument('--disable-default-app')
        # options.add_argument("--disable-notifications")
        # options.add_experimental_option('excludeSwitches', ['disable-popup-blocking'])

        # driver = webdriver.Chrome(options=options)

        driver = webdriver.Chrome(options=options)
        driver.maximize_window()  # 브라우저 창을 최대화합니다.

        url = 'http://www.iros.go.kr/PMainJ.jsp'
        driver.get(url)
        wait = WebDriverWait(driver, 3)

        # 로딩 오버레이가 사라질 때까지 대기
        wait.until(EC.invisibility_of_element_located((By.ID, "AnySign4PCLoadingImg_overlay")))

        # 1번 팝업 제거
        # pyautogui.moveTo(1406, 80)
        # pyautogui.click()
        # # 2번 팝업 제거
        # pyautogui.moveTo(1415, 482)
        # pyautogui.click()
        # # 3번 팝업 제거
        # pyautogui.moveTo(826, 295)
        # pyautogui.click()


        # 로그인
        issue.update_status(3)
        wait.until(EC.visibility_of_element_located((By.ID, 'id_user_id')))
        login_input = driver.find_element(By.ID, 'id_user_id')
        # driver.execute_script("arguments[0].value = 'wooju57';", login_input)
        driver.execute_script("arguments[0].value = '" +constants.IROS_ID+"';", login_input)

        wait.until(EC.visibility_of_element_located((By.ID, 'password')))
        password_input = driver.find_element(By.ID, 'password')
        # driver.execute_script("arguments[0].value = 'Wooju301806';", password_input)
        driver.execute_script("arguments[0].value = '"+constants.IROS_PASSWORD+"';", password_input)

        element_to_click = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="leftS"]/div[2]/form/div[1]/ul/li[4]/a')))
        # 로그인 버튼 클릭
        # driver.find_element(By.XPATH, '//*[@id="leftS"]/div[2]/form/div[1]/ul/li[4]/a').click()
        login_button = driver.find_element(By.XPATH, '//*[@id="leftS"]/div[2]/form/div[1]/ul/li[4]/a')
        driver.execute_script("arguments[0].click();", login_button)

        # 로그인 후 로그아웃 버튼이 뜰 때까지 대기
        wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="leftS"]/div[2]/div[1]')))

        issue.update_status(4)
        # 부동산 > 열람/발급(출력) click
        element_to_click = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="cenS"]/div/ul/li[1]/div/ul/li[1]/a')))
        driver.execute_script("arguments[0].click();", element_to_click)
        # driver.find_element(By.XPATH, '//*[@id="cenS"]/div/ul/li[1]/div/ul/li[1]/a').click()

        # 팝업 한번 더 제거
        current_handle = driver.current_window_handle
        handles = driver.window_handles
        for handle in handles:
            if handle == current_handle:
                continue
            driver.switch_to.window(handle)
            driver.close()
        driver.switch_to.window(current_handle)

        issue.update_status(5)
        # 등기 열람/발급 > 고유번호로 찾기
        # wait.until(EC.invisibility_of_element_located((By.ID, "AnySign4PCLoadingImg_overlay")))
        driver.switch_to.frame("inputFrame") # iframe 내에서 작업 처리
        wait.until(EC.presence_of_element_located((By.ID, 'search04Tab')))
        search_tab = driver.find_element(By.ID, 'search04Tab')
        driver.execute_script("arguments[0].click();", search_tab)


        driver.switch_to.default_content()
        driver.switch_to.frame("resultFrame")
        driver.switch_to.frame("frmOuterModal")
        wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="inpPinNo"]')))
        input_serialNum = driver.find_element(By.ID, "inpPinNo")
        # 전달받은 고유번호 send_keys에 전달 !!!
        input_serialNum.send_keys(regId)

        # 1. <고유번호로 부동산 등기 검색> 버튼 클릭
        wait.until(EC.visibility_of_element_located((By.XPATH, '/html/body/div/form/div/div/div/div/fieldset/div/table/tbody/tr[3]/td[3]/button')))
        search_button = driver.find_element(By.XPATH, '/html/body/div/form/div/div/div/div/fieldset/div/table/tbody/tr[3]/td[3]/button')
        driver.execute_script("arguments[0].click();", search_button)

        # 2. <건물 부동산 소재번 선택> 버튼 클릭
        wait.until(EC.visibility_of_element_located((By.XPATH, '/html/body/div[2]/div[2]/table/tbody/tr[2]/td[5]/button')))
        select_property_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[2]/table/tbody/tr[2]/td[5]/button')
        driver.execute_script("arguments[0].click();", select_property_button)

        # 3. <등기기록 유형 선택> 다음 버튼 클릭
        wait.until(EC.visibility_of_element_located((By.XPATH, '/html/body/div/form/div[4]/button')))
        next_button = driver.find_element(By.XPATH, '/html/body/div/form/div[4]/button')
        driver.execute_script("arguments[0].click();", next_button)

        # 4. <주민등록번호 공개여부 검증> 다음 버튼 클릭
        try:
            wait.until(EC.visibility_of_element_located((By.XPATH, '/html/body/div/form/div[5]/button')))
        except:
            skip_button = driver.find_element(By.CLASS_NAME, "btn_bg02_action")
            skip_button.click()

        verify_button = driver.find_element(By.XPATH, '/html/body/div/form/div[5]/button')
        driver.execute_script("arguments[0].click();", verify_button)

        issue.update_status(6)

        # 결제 버튼 클릭은 frmOuterModal 밖, resultFrame 안에 있기 때문에 iframe을 조정
        driver.switch_to.default_content()
        driver.switch_to.frame("resultFrame")
        # 5. <결제 대상 부동산> 결제 버튼 클릭
        # wait.until(EC.visibility_of_element_located((By.XPATH, '/html/body/div/form[2]/div[1]/table/tbody/tr[3]/td[3]/button')))
        time.sleep(1)   # "AnySign 이 아직 로딩되지 않았습니다. 잠시만 기다려 주십시요." 예외처리
        pay_button = driver.find_element(By.XPATH, '/html/body/div/form[2]/div[1]/table/tbody/tr[3]/td[3]/button')
        driver.execute_script("arguments[0].click();", pay_button)


        driver.switch_to.default_content()
        # 6. 결제진행과정
        issue.update_status(7)

        # 결제 방식 선택 버튼이 나타날 때까지 기다립니다.
        paymentway_button_xpath = '//*[@id="inpMtdCls3"]'
        wait.until(EC.visibility_of_element_located((By.XPATH, paymentway_button_xpath)))
        # 선불지급수단 결제방식 선택
        paymentway_button = driver.find_element(By.XPATH, '//*[@id="inpMtdCls3"]')
        driver.execute_script("arguments[0].click();", paymentway_button)

        wait.until(EC.visibility_of_element_located((By.ID, 'inpEMoneyNo1')))
        paymentTokenFirst8 = driver.find_element(By.ID, 'inpEMoneyNo1')
        driver.execute_script("arguments[0].value = 'X3263838';", paymentTokenFirst8)

        wait.until(EC.visibility_of_element_located((By.ID, 'inpEMoneyNo2')))
        paymentTokenLast4 = driver.find_element(By.ID, 'inpEMoneyNo2')
        driver.execute_script("arguments[0].value = '3664';", paymentTokenLast4)

        wait.until(EC.visibility_of_element_located((By.ID, 'inpEMoneyPswd')))
        paymentTokenPswd = driver.find_element(By.ID, 'inpEMoneyPswd')
        driver.execute_script("arguments[0].value = 'UJXJxYz5';", paymentTokenPswd)

        agreeCheckBox = driver.find_element(By.XPATH, '//*[@id="chk_term_agree_all_emoney"]')
        driver.execute_script("arguments[0].click();", agreeCheckBox)

        wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="EMO"]/div[5]/button[1]')))
        payButton = driver.find_element(By.XPATH, '//*[@id="EMO"]/div[5]/button[1]')

        # while True:
        #     try:
        #         print("Test anysign")
        #         with connect("wss://localhost:10531/", ssl_context=ssl.SSLContext(ssl.CERT_NONE)) as websocket:
        #             print("Conn success")
        #             websocket.close()
        #         print("Test anysign success")
        #         break
        #     except Exception as e:
        #         print(e)
        #         time.sleep(0.5)
        #         continue

        time.sleep(3)

        driver.execute_script('arguments[0].click();', payButton)
        issue.update_status(8)

        time.sleep(5)

        try:
            alert = driver.switch_to.alert
            print(alert.text)
            alert.accept()  # 팝업 확인 버튼 클릭
            # alert.dismiss()  # 팝업 취소 버튼 클릭 (필요한 경우)
        except:
            print("No alert present.")

        issue.update_status(9)
        time.sleep(5)

        handles = driver.window_handles
        if len(handles) == 2:
            driver.switch_to.window(handles[1])
            try:
                next_button = driver.find_element(By.CLASS_NAME, 'btn_bg04_action')
                next_button.click()

                time.sleep(3)

                driver.switch_to.alert
                alert.accept()

                time.sleep(5)

            except:
                pass

            
            driver.switch_to.window(current_handle)


        handles = driver.window_handles
        if len(handles) == 2:
            driver.switch_to.window(handles[1])
            next_button = driver.find_element(By.CLASS_NAME, 'btn_bg02_action')
            next_button.click()

        driver.switch_to.window(current_handle)

        time.sleep(5)

        ###########################################################
        # "미열람/미발급 보기" page
        issue.update_status(10)
        wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="Lcontent"]/form[1]/div[5]/table/tbody/tr[2]/td[11]/button')))
        open_Button = driver.find_element(By.XPATH, '//*[@id="Lcontent"]/form[1]/div[5]/table/tbody/tr[2]/td[11]/button')
        driver.execute_script('arguments[0].click();', open_Button)

        time.sleep(3)

        issue.update_status(11)
        handles = driver.window_handles
        if len(handles) == 2:
            driver.switch_to.window(handles[1])
            next_button = driver.find_element(By.CLASS_NAME, 'btn_blue')
            next_button.click()

            driver.switch_to.window(current_handle)

            time.sleep(3)

            pyautogui.moveTo(786, 190)
            pyautogui.click()

            time.sleep(10)

            pyautogui.moveTo(897, 539)
            pyautogui.click()
            time.sleep(5)

            pyautogui.moveTo(1085, 774)
            pyautogui.click()
            time.sleep(3)

            pyautogui.moveTo(786, 190)
            pyautogui.click()
            time.sleep(10)

            pyautogui.moveTo(1141, 496)
            pyautogui.click()
            time.sleep(3)

            pyautogui.moveTo(832, 631)
            pyautogui.click()
            time.sleep(5)

            pyautogui.typewrite(fileName)
            time.sleep(2)

            pyautogui.moveTo(1353, 874)
            pyautogui.click()
            time.sleep(5)

            pyautogui.moveTo(1238, 125)
            pyautogui.click()
            time.sleep(1)

            pyautogui.moveTo(873, 528)
            pyautogui.click()
            time.sleep(1)

            pyautogui.moveTo(1482, 12)
            pyautogui.click()

            issue.update_status(12)

            issue.upload_pdf("C:\\Users\\Administrator\\Desktop\\" + fileName + ".pdf", "realEstate/" + fileName + ".pdf")

    except Exception as e:
        print(e)
        pyautogui.moveTo(786, 190)
        pyautogui.click()
        time.sleep(10)

        pyautogui.moveTo(897, 539)
        pyautogui.click()
        time.sleep(5)

        pyautogui.moveTo(1085, 774)
        pyautogui.click()
        time.sleep(3)

        pyautogui.moveTo(786, 190)
        pyautogui.click()
        time.sleep(10)

        pyautogui.moveTo(1141, 496)
        pyautogui.click()
        time.sleep(3)

        pyautogui.moveTo(832, 631)
        pyautogui.click()
        time.sleep(5)

        pyautogui.typewrite(fileName)
        time.sleep(2)

        pyautogui.moveTo(1353, 874)
        pyautogui.click()
        time.sleep(5)

        pyautogui.moveTo(1238, 125)
        pyautogui.click()
        time.sleep(1)

        pyautogui.moveTo(873, 528)
        pyautogui.click()
        time.sleep(1)

        pyautogui.moveTo(1482, 12)
        pyautogui.click()

        issue.update_status(12)
        issue.upload_pdf("C:\\Users\\Administrator\\Desktop\\" + fileName + ".pdf", "realEstate/" + fileName + ".pdf")
    
    pyautogui.moveTo(1442, 124)
    pyautogui.click()
    issue.update_status(13)